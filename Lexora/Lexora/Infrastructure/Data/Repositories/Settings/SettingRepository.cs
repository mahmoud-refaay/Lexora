using System.Data;
using Dapper;
using Lexora.Domain.Entities;
using Lexora.Application.Interfaces.Repositories;

namespace Lexora.Infrastructure.Data.Repositories.Settings;

public class SettingRepository : ISettingRepository
{
    private readonly DbConnectionFactory _connectionFactory;

    public SettingRepository(DbConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<IEnumerable<Setting>> GetAllAsync()
    {
        using var connection = _connectionFactory.CreateConnection();
        return await connection.QueryAsync<Setting>(
            "sp_Settings_GetAll",
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<Setting?> GetByKeyAsync(string key)
    {
        using var connection = _connectionFactory.CreateConnection();
        return await connection.QueryFirstOrDefaultAsync<Setting>(
            "sp_Settings_GetByKey",
            new { SettingKey = key },
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task UpdateAsync(string key, string? value, int? updatedByUserId = null)
    {
        using var connection = _connectionFactory.CreateConnection();
        var parameters = new
        {
            SettingKey = key,
            NewValue = value,
            UpdatedByUserId = updatedByUserId
        };

        await connection.ExecuteAsync(
            "sp_Settings_Update",
            parameters,
            commandType: CommandType.StoredProcedure
        );
    }
}
