using Lexora.Domain.Entities;

namespace Lexora.Application.Interfaces.Repositories.Notifications;

public interface INotificationRepository
{
    Task CreateAsync(int userId, string message);
    Task<IEnumerable<Notification>> GetByUserIdAsync(int userId, int pageNumber, int pageSize, bool unreadOnly = false);
    Task MarkAsReadAsync(int notificationId, int userId);
    Task<int> GetUnreadCountAsync(int userId);
}
