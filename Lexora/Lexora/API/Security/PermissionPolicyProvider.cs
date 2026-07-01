using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;

namespace Lexora.API.Security;

public class PermissionPolicyProvider : DefaultAuthorizationPolicyProvider
{
    public PermissionPolicyProvider(IOptions<AuthorizationOptions> options) : base(options)
    {
    }

    public override async Task<AuthorizationPolicy?> GetPolicyAsync(string policyName)
    {
        // التحقق أولاً من وجود سياسة مسجلة بشكل صريح (مثل سياسات المصادقة العادية)
        var policy = await base.GetPolicyAsync(policyName);
        if (policy != null)
        {
            return policy;
        }

        // توليد سياسة جديدة بشكل ديناميكي بناءً على اسم الصلاحية المطلوبة
        return new AuthorizationPolicyBuilder()
            .AddRequirements(new PermissionRequirement(policyName))
            .Build();
    }
}
