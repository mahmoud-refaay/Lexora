using System.Text;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.IdentityModel.Tokens;
using Lexora.Application.Interfaces.Repositories;
using Lexora.Application.Interfaces.Security;
using Lexora.Application.Interfaces.Services;
using Lexora.Application.Services;
using Lexora.Infrastructure.Data;
using Lexora.Infrastructure.Data.Repositories;
using Lexora.Infrastructure.Security;
using Lexora.API.Middlewares;
using Lexora.API.Security;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// ==========================================
// 1. تسجيل الخدمات والـ Repositories في الـ DI
// ==========================================

// مصنع اتصالات قاعدة البيانات (SQL Server)
builder.Services.AddSingleton<DbConnectionFactory>();

// مستودعات البيانات (Repositories)
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();
builder.Services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
builder.Services.AddScoped<ISettingRepository, SettingRepository>();
builder.Services.AddScoped<IAuditLogRepository, AuditLogRepository>();
builder.Services.AddScoped<INotificationRepository, NotificationRepository>();
builder.Services.AddScoped<IClientRepository, ClientRepository>();
builder.Services.AddScoped<IClientNoteRepository, ClientNoteRepository>();
builder.Services.AddScoped<ICaseRepository, CaseRepository>();
builder.Services.AddScoped<ICaseNoteRepository, CaseNoteRepository>();

// خدمات الأمن والمصادقة (Security Services)
builder.Services.AddSingleton<IPasswordHasher, BCryptPasswordHasher>();
builder.Services.AddScoped<IJwtProvider, JwtProvider>();

// خدمات التطبيق (Application Services)
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IClientService, ClientService>();
builder.Services.AddScoped<ICaseService, CaseService>();

// إعداد الكاش في الذاكرة لتتبع محاولات الدخول الخاطئة وقفل الحسابات مؤقتاً
builder.Services.AddMemoryCache();

// إعداد تحديد معدل الطلبات (Rate Limiting) لحماية نقاط الدخول الحساسة
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.OnRejected = async (context, token) =>
    {
        context.HttpContext.Response.ContentType = "application/json";
        context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
        await context.HttpContext.Response.WriteAsJsonAsync(new { error = "لقد تجاوزت الحد الأقصى لمحاولات تسجيل الدخول المسموح بها في الدقيقة. يرجى المحاولة لاحقاً." }, token);
    };
    options.AddPolicy("LoginLimit", httpContext =>
    {
        var ip = httpContext.Connection.RemoteIpAddress?.ToString() 
            ?? httpContext.Request.Headers["X-Forwarded-For"].ToString() 
            ?? "unknown";
        return RateLimitPartition.GetFixedWindowLimiter(ip, _ => new FixedWindowRateLimiterOptions
        {
            Window = TimeSpan.FromMinutes(1),
            PermitLimit = 5,
            QueueLimit = 0
        });
    });
});

// تسجيل مزود السياسات ومعالج التفويض المخصص للصلاحيات (Dynamic Permissions Authorization)
builder.Services.AddSingleton<IAuthorizationPolicyProvider, PermissionPolicyProvider>();
builder.Services.AddScoped<IAuthorizationHandler, PermissionAuthorizationHandler>();

// ==========================================
// 2. إعداد الـ Authentication والـ JWT Bearer
// ==========================================
var secretKey = Environment.GetEnvironmentVariable("JWT_SECRET")
    ?? builder.Configuration["Jwt:Secret"]
    ?? throw new InvalidOperationException("JWT Secret is not configured in appsettings.");
var issuer = builder.Configuration["Jwt:Issuer"];
var audience = builder.Configuration["Jwt:Audience"];

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = issuer,
        ValidAudience = audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        ClockSkew = TimeSpan.Zero // إلغاء وقت السماح الإضافي لانتهاء صلاحية التوكن بشكل دقيق فور انتهاء صلاحيته
    };
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddControllers();

// إعداد OpenAPI لتوليد التوثيق (Swagger)
builder.Services.AddOpenApi();

var app = builder.Build();

// ==========================================
// 3. إعداد خط أنابيب الطلبات (Request Pipeline)
// ==========================================

// استخدام الـ Middleware المخصص لمعالجة الأخطاء في مقدمة خط الأنابيب
app.UseMiddleware<ExceptionHandlingMiddleware>();

// تفعيل CORS للسماح لطلبات الـ Frontend بالوصول
app.UseCors("AllowFrontend");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    // واجهة Scalar لاختبار الـ API تفاعلياً (تتوفّر في بيئة التطوير فقط)
    app.MapScalarApiReference(options =>
    {
        options.Title = "Lexora API";
        options.Theme = ScalarTheme.Purple;
        options.DefaultHttpClient = new(ScalarTarget.CSharp, ScalarClient.HttpClient);
        options.OpenApiRoutePattern = "/openapi/v1.json";
    });
}

app.UseHttpsRedirection();

// تفعيل تحديد معدل الطلبات
app.UseRateLimiter();

// تفعيل المصادقة والتحقق من الهوية (مهم أن تكون Authentication قبل Authorization)
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
