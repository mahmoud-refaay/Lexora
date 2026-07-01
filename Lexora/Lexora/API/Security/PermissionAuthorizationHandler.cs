using Microsoft.AspNetCore.Authorization;

namespace Lexora.API.Security;

public class PermissionAuthorizationHandler : AuthorizationHandler<PermissionRequirement>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context, 
        PermissionRequirement requirement)
    {
        // جلب جميع ادعاءات الصلاحيات الممنوحة للمستخدم في التوكن
        var permissions = context.User.FindAll("permission").Select(c => c.Value);

        // التحقق من احتواء القائمة على الصلاحية المطلوبة
        if (permissions.Contains(requirement.Permission))
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}
