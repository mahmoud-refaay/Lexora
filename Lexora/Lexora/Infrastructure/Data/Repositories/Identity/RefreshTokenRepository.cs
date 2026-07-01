using System.Data;
using Dapper;
using Lexora.Domain.Entities;
using Lexora.Application.Interfaces.Repositories;

namespace Lexora.Infrastructure.Data.Repositories.Identity;

public class RefreshTokenRepository : IRefreshTokenRepository
{
    private readonly DbConnectionFactory _connectionFactory;

    public RefreshTokenRepository(DbConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<int> CreateAsync(RefreshToken token)
    {
        using var connection = _connectionFactory.CreateConnection();
        var parameters = new
        {
            UserId = token.UserId,
            FamilyId = token.FamilyId,
            TokenHash = token.TokenHash,
            ExpiresAt = token.ExpiresAt,
            CreatedByIp = token.CreatedByIp
        };

        var id = await connection.ExecuteScalarAsync<int>(
            "sp_RefreshTokens_Create",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return id;
    }

    public async Task<RefreshToken?> GetByTokenHashAsync(string tokenHash)
    {
        using var connection = _connectionFactory.CreateConnection();
        var token = await connection.QueryFirstOrDefaultAsync<RefreshToken>(
            "sp_RefreshTokens_GetByTokenHash",
            new { TokenHash = tokenHash },
            commandType: CommandType.StoredProcedure
        );

        return token;
    }

    public async Task<(int NewTokenId, int UserId)> RotateAsync(string oldTokenHash, string newTokenHash, DateTime newExpiresAt, string? clientIp = null)
    {
        using var connection = _connectionFactory.CreateConnection();
        var parameters = new
        {
            OldTokenHash = oldTokenHash,
            NewTokenHash = newTokenHash,
            NewExpiresAt = newExpiresAt,
            ClientIp = clientIp
        };

        var result = await connection.QueryAsync<dynamic>(
            "sp_RefreshTokens_Rotate",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        var row = result.FirstOrDefault();
        if (row == null)
        {
            throw new InvalidOperationException("Failed to rotate refresh token. No result returned from stored procedure.");
        }

        return (row.NewTokenId, row.UserId);
    }

    public async Task RevokeByUserIdAsync(int userId, string? reason = null, string? clientIp = null)
    {
        using var connection = _connectionFactory.CreateConnection();
        var parameters = new
        {
            UserId = userId,
            Reason = reason,
            ClientIp = clientIp
        };

        await connection.ExecuteAsync(
            "sp_RefreshTokens_RevokeByUserId",
            parameters,
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task CleanupExpiredAsync(int daysOld = 30)
    {
        using var connection = _connectionFactory.CreateConnection();
        await connection.ExecuteAsync(
            "sp_RefreshTokens_CleanupExpired",
            new { DaysOld = daysOld },
            commandType: CommandType.StoredProcedure
        );
    }
}
