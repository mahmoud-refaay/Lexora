using System.Data;
using Dapper;
using Lexora.Domain.Entities;
using Lexora.Application.Interfaces.Repositories;

namespace Lexora.Infrastructure.Data.Repositories.Identity;

public class RoleRepository : IRoleRepository
{
    private readonly DbConnectionFactory _connectionFactory;

    public RoleRepository(DbConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<IEnumerable<Role>> GetAllRolesAsync()
    {
        using var connection = _connectionFactory.CreateConnection();
        return await connection.QueryAsync<Role>(
            "sp_Roles_GetAll",
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<Role?> GetRoleByIdAsync(int id)
    {
        using var connection = _connectionFactory.CreateConnection();
        return await connection.QueryFirstOrDefaultAsync<Role>(
            "sp_Roles_GetById",
            new { Id = id },
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task AssignRoleAsync(int userId, int roleId, int? assignedByUserId = null)
    {
        using var connection = _connectionFactory.CreateConnection();
        var parameters = new
        {
            UserId = userId,
            RoleId = roleId,
            AssignedByUserId = assignedByUserId
        };

        await connection.ExecuteAsync(
            "sp_UserRoles_Assign",
            parameters,
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task RemoveRoleAsync(int userId, int roleId)
    {
        using var connection = _connectionFactory.CreateConnection();
        var parameters = new
        {
            UserId = userId,
            RoleId = roleId
        };

        await connection.ExecuteAsync(
            "sp_UserRoles_Remove",
            parameters,
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<IEnumerable<Role>> GetRolesByUserIdAsync(int userId)
    {
        using var connection = _connectionFactory.CreateConnection();
        return await connection.QueryAsync<Role>(
            "sp_UserRoles_GetByUserId",
            new { UserId = userId },
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<IEnumerable<Permission>> GetPermissionsByRoleIdAsync(int roleId)
    {
        using var connection = _connectionFactory.CreateConnection();
        return await connection.QueryAsync<Permission>(
            "sp_RolePermissions_GetByRoleId",
            new { RoleId = roleId },
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<IEnumerable<Permission>> GetAllPermissionsAsync()
    {
        using var connection = _connectionFactory.CreateConnection();
        return await connection.QueryAsync<Permission>(
            "sp_Permissions_GetAll",
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<IEnumerable<string>> GetUserPermissionsAsync(int userId)
    {
        using var connection = _connectionFactory.CreateConnection();
        return await connection.QueryAsync<string>(
            "sp_Auth_GetUserPermissions",
            new { UserId = userId },
            commandType: CommandType.StoredProcedure
        );
    }
}
