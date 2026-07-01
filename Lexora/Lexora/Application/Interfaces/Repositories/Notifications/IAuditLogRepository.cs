using Lexora.Domain.Entities;

namespace Lexora.Application.Interfaces.Repositories.Notifications;

public interface IAuditLogRepository
{
    Task CreateAsync(AuditLog auditLog);
    Task<(IEnumerable<AuditLog> Logs, int TotalCount)> SearchAsync(
        int? userId, 
        string? action, 
        string? entityName, 
        DateTime? fromDate, 
        DateTime? toDate, 
        int pageNumber, 
        int pageSize);
}
