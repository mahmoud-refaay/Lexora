using Lexora.Application.Interfaces.Security;
using Microsoft.Extensions.Configuration;

namespace Lexora.Infrastructure.Security;

public class BCryptPasswordHasher : IPasswordHasher
{
    private readonly int _workFactor;

    public BCryptPasswordHasher(IConfiguration configuration)
    {
        var configValue = configuration["Security:BCryptWorkFactor"];
        _workFactor = int.TryParse(configValue, out var factor) && factor >= 4 && factor <= 31 ? factor : 11;
    }

    public string Hash(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password, _workFactor);
    }

    public bool Verify(string password, string passwordHash)
    {
        return BCrypt.Net.BCrypt.Verify(password, passwordHash);
    }
}
