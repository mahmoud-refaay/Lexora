using Lexora.Domain.Entities;

namespace Lexora.Application.Interfaces.Repositories.Identity;

public interface IRefreshTokenRepository
{
    Task<int> CreateAsync(RefreshToken token);
    Task<RefreshToken?> GetByTokenHashAsync(string tokenHash);
    Task<(int NewTokenId, int UserId)> RotateAsync(string oldTokenHash, string newTokenHash, DateTime newExpiresAt, string? clientIp = null);
    Task RevokeByUserIdAsync(int userId, string? reason = null, string? clientIp = null);
    Task CleanupExpiredAsync(int daysOld = 30);
}
