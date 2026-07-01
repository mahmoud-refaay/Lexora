using System.Data;
using Dapper;
using Lexora.Domain.Entities;
using Lexora.Application.Interfaces.Repositories;

namespace Lexora.Infrastructure.Data.Repositories.Notifications;

public class NotificationRepository : INotificationRepository
{
    private readonly DbConnectionFactory _connectionFactory;

    public NotificationRepository(DbConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task CreateAsync(int userId, string message)
    {
        using var connection = _connectionFactory.CreateConnection();
        var parameters = new
        {
            UserId = userId,
            Message = message
        };

        await connection.ExecuteAsync(
            "sp_Notifications_Create",
            parameters,
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<IEnumerable<Notification>> GetByUserIdAsync(int userId, int pageNumber, int pageSize, bool unreadOnly = false)
    {
        using var connection = _connectionFactory.CreateConnection();
        var parameters = new
        {
            UserId = userId,
            PageNumber = pageNumber,
            PageSize = pageSize,
            UnreadOnly = unreadOnly
        };

        return await connection.QueryAsync<Notification>(
            "sp_Notifications_GetByUserId",
            parameters,
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task MarkAsReadAsync(int notificationId, int userId)
    {
        using var connection = _connectionFactory.CreateConnection();
        var parameters = new
        {
            NotificationId = notificationId,
            UserId = userId
        };

        await connection.ExecuteAsync(
            "sp_Notifications_MarkAsRead",
            parameters,
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<int> GetUnreadCountAsync(int userId)
    {
        using var connection = _connectionFactory.CreateConnection();
        var count = await connection.ExecuteScalarAsync<int>(
            "sp_Notifications_GetUnreadCount",
            new { UserId = userId },
            commandType: CommandType.StoredProcedure
        );

        return count;
    }
}
