using Lexora.Domain.Entities;

namespace Lexora.Application.Interfaces.Security;

public interface IJwtProvider
{
    string GenerateToken(User user, IEnumerable<string> permissions);
    string GenerateRefreshToken();
}
