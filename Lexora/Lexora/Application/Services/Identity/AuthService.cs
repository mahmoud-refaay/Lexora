using System.Security.Cryptography;
using System.Text;
using Lexora.Application.DTOs.Auth;
using Lexora.Application.Interfaces.Repositories;
using Lexora.Application.Interfaces.Security;
using Lexora.Application.Interfaces.Services;
using Lexora.Domain.Entities;
using Lexora.Domain.Exceptions;
using Microsoft.Extensions.Caching.Memory;

namespace Lexora.Application.Services.Identity;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IRoleRepository _roleRepository;
    private readonly IRefreshTokenRepository _refreshTokenRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtProvider _jwtProvider;
    private readonly IMemoryCache _memoryCache;

    public AuthService(
        IUserRepository userRepository,
        IRoleRepository roleRepository,
        IRefreshTokenRepository refreshTokenRepository,
        IPasswordHasher passwordHasher,
        IJwtProvider jwtProvider,
        IMemoryCache memoryCache)
    {
        _userRepository = userRepository;
        _roleRepository = roleRepository;
        _refreshTokenRepository = refreshTokenRepository;
        _passwordHasher = passwordHasher;
        _jwtProvider = jwtProvider;
        _memoryCache = memoryCache;
    }

    public async Task<LoginResponseDto> LoginAsync(LoginRequestDto dto, string? ipAddress = null, string? userAgent = null)
    {
        var cacheKey = $"lockout:{dto.Username.Trim().ToLower()}";

        // 1. التحقق مما إذا كان الحساب مغلقاً مؤقتاً
        if (_memoryCache.TryGetValue(cacheKey, out int failedAttempts) && failedAttempts >= 5)
        {
            throw new DomainException("تم قفل حسابك مؤقتاً بسبب محاولات دخول خاطئة متعددة. يرجى المحاولة بعد 15 دقيقة.");
        }

        // 2. الحصول على المستخدم باستخدام اسم المستخدم
        var user = await _userRepository.GetByUsernameAsync(dto.Username);
        if (user == null || !user.IsActive)
        {
            throw new DomainException("اسم المستخدم أو كلمة المرور غير صحيحة.");
        }

        // 3. التحقق من صحة كلمة المرور
        if (!_passwordHasher.Verify(dto.Password, user.PasswordHash))
        {
            // زيادة عداد المحاولات الفاشلة وحفظه في الكاش لمدة 15 دقيقة
            failedAttempts++;
            var cacheOptions = new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(15)
            };
            _memoryCache.Set(cacheKey, failedAttempts, cacheOptions);

            if (failedAttempts >= 5)
            {
                throw new DomainException("تم قفل حسابك مؤقتاً بسبب محاولات دخول خاطئة متعددة. يرجى المحاولة بعد 15 دقيقة.");
            }

            throw new DomainException("اسم المستخدم أو كلمة المرور غير صحيحة.");
        }

        // تصفير عداد المحاولات الفاشلة عند تسجيل الدخول بنجاح
        _memoryCache.Remove(cacheKey);

        // 3. جلب صلاحيات المستخدم
        var permissions = await _roleRepository.GetUserPermissionsAsync(user.Id);

        // 4. توليد الـ Access Token (JWT)
        var token = _jwtProvider.GenerateToken(user, permissions);

        // 5. توليد وحفظ رمز التحديث (Refresh Token)
        var rawRefreshToken = _jwtProvider.GenerateRefreshToken();
        var tokenHash = ComputeSha256Hash(rawRefreshToken);
        var expiresAt = DateTime.UtcNow.AddDays(7); // صلاحية الـ Refresh Token هي 7 أيام

        var refreshTokenEntity = new RefreshToken
        {
            UserId = user.Id,
            FamilyId = Guid.NewGuid().ToString(), // توليد معرّف عائلة فريد لتتبع سلسلة التوكنز
            TokenHash = tokenHash,
            ExpiresAt = expiresAt,
            CreatedByIp = ipAddress
        };

        await _refreshTokenRepository.CreateAsync(refreshTokenEntity);

        return new LoginResponseDto
        {
            Token = token,
            RefreshToken = rawRefreshToken,
            ExpiresAt = expiresAt,
            UserId = user.Id,
            Username = user.Username,
            FullName = user.Person?.FullName ?? string.Empty
        };
    }

    public async Task<LoginResponseDto> RefreshTokenAsync(RefreshTokenRequestDto dto, string? ipAddress = null)
    {
        var oldTokenHash = ComputeSha256Hash(dto.RefreshToken);

        // 1. جلب رمز التحديث من قاعدة البيانات
        var existingToken = await _refreshTokenRepository.GetByTokenHashAsync(oldTokenHash);
        if (existingToken == null)
        {
            throw new DomainException("رمز التحديث غير صالح.");
        }

        // 2. التحقق من عدم إلغاء التوكن أو انتهاء صلاحيته
        if (existingToken.RevokedAt != null)
        {
            // في حالة إعادة استخدام رمز ملغى (محاولة اختراق)، نقوم بإلغاء جميع رموز هذا المستخدم فوراً للحماية
            await _refreshTokenRepository.RevokeByUserIdAsync(existingToken.UserId, "Token reuse detected. Revoking family.", ipAddress);
            throw new DomainException("تم كشف محاولة استخدام رمز تحديث ملغى. تم إلغاء جميع الرموز النشطة لهذا المستخدم لأسباب أمنية.");
        }

        if (existingToken.ExpiresAt < DateTime.UtcNow)
        {
            throw new DomainException("رمز التحديث منتهي الصلاحية.");
        }

        // 3. جلب بيانات المستخدم للتأكد من نشاطه
        var user = await _userRepository.GetByIdAsync(existingToken.UserId);
        if (user == null || !user.IsActive)
        {
            throw new DomainException("المستخدم غير موجود أو غير نشط.");
        }

        // 4. جلب الصلاحيات
        var permissions = await _roleRepository.GetUserPermissionsAsync(user.Id);

        // 5. توليد Access Token جديد
        var token = _jwtProvider.GenerateToken(user, permissions);

        // 6. توليد رمز تحديث جديد وعمل تدوير (Rotation)
        var newRawRefreshToken = _jwtProvider.GenerateRefreshToken();
        var newTokenHash = ComputeSha256Hash(newRawRefreshToken);
        var newExpiresAt = DateTime.UtcNow.AddDays(7);

        // استدعاء عملية التدوير الذرية (Atomic Rotation) في قاعدة البيانات
        await _refreshTokenRepository.RotateAsync(oldTokenHash, newTokenHash, newExpiresAt, ipAddress);

        return new LoginResponseDto
        {
            Token = token,
            RefreshToken = newRawRefreshToken,
            ExpiresAt = newExpiresAt,
            UserId = user.Id,
            Username = user.Username,
            FullName = user.Person?.FullName ?? string.Empty
        };
    }

    public async Task ChangePasswordAsync(int userId, ChangePasswordRequestDto dto, string? ipAddress = null, string? userAgent = null)
    {
        // 1. التحقق من وجود ونشاط المستخدم
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null || !user.IsActive)
        {
            throw new DomainException("المستخدم غير موجود أو غير نشط.");
        }

        // 2. التحقق من كلمة المرور الحالية
        if (!_passwordHasher.Verify(dto.CurrentPassword, user.PasswordHash))
        {
            throw new DomainException("كلمة المرور الحالية غير صحيحة.");
        }

        // 2.5 التحقق من قوة كلمة المرور الجديدة
        PasswordValidator.Validate(dto.NewPassword);

        // 3. تشفير وتحديث كلمة المرور الجديدة
        var newPasswordHash = _passwordHasher.Hash(dto.NewPassword);
        await _userRepository.UpdatePasswordAsync(userId, newPasswordHash, ipAddress, userAgent);

        // 4. إلغاء جميع رموز التحديث النشطة لإجبار المستخدم على إعادة تسجيل الدخول من جميع الأجهزة
        await _refreshTokenRepository.RevokeByUserIdAsync(userId, "Password changed.", ipAddress);
    }

    public async Task LogoutAsync(int userId, string? ipAddress = null)
    {
        // إلغاء جميع رموز التحديث عند تسجيل الخروج
        await _refreshTokenRepository.RevokeByUserIdAsync(userId, "Logout.", ipAddress);
    }

    private static string ComputeSha256Hash(string rawData)
    {
        using var sha256 = SHA256.Create();
        var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(rawData));
        return Convert.ToBase64String(bytes);
    }
}
