using System.Data;
using Dapper;
using Lexora.Domain.Entities;
using Lexora.Application.Interfaces.Repositories;

namespace Lexora.Infrastructure.Data.Repositories.Notifications;

public class AuditLogRepository : IAuditLogRepository
{
    private readonly DbConnectionFactory _connectionFactory;

    public AuditLogRepository(DbConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task CreateAsync(AuditLog auditLog)
    {
        using var connection = _connectionFactory.CreateConnection();
        var parameters = new
        {
            UserId = auditLog.UserId,
            Action = auditLog.Action,
            EntityName = auditLog.EntityName,
            EntityId = auditLog.EntityId,
            OldValues = auditLog.OldValues,
            NewValues = auditLog.NewValues,
            IpAddress = auditLog.IpAddress,
            UserAgent = auditLog.UserAgent,
            TraceId = auditLog.TraceId
        };

        await connection.ExecuteAsync(
            "sp_AuditLogs_Create",
            parameters,
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<(IEnumerable<AuditLog> Logs, int TotalCount)> SearchAsync(
        int? userId, 
        string? action, 
        string? entityName, 
        DateTime? fromDate, 
        DateTime? toDate, 
        int pageNumber, 
        int pageSize)
    {
        using var connection = _connectionFactory.CreateConnection();
        var parameters = new DynamicParameters();
        parameters.Add("@UserId", userId);
        parameters.Add("@Action", action);
        parameters.Add("@EntityName", entityName);
        parameters.Add("@FromDate", fromDate);
        parameters.Add("@ToDate", toDate);
        parameters.Add("@PageNumber", pageNumber);
        parameters.Add("@PageSize", pageSize);
        parameters.Add("@TotalCount", dbType: DbType.Int32, direction: ParameterDirection.Output);

        var logs = await connection.QueryAsync<AuditLog>(
            "sp_AuditLogs_Search",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        int totalCount = parameters.Get<int>("@TotalCount");
        return (logs, totalCount);
    }
}
