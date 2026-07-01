using System.Data;
using Dapper;
using Lexora.Domain.Entities;
using Lexora.Application.Interfaces.Repositories;

namespace Lexora.Infrastructure.Data.Repositories.Identity;

public class UserRepository : IUserRepository
{
    private readonly DbConnectionFactory _connectionFactory;

    public UserRepository(DbConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<User?> GetByIdAsync(int id)
    {
        using var connection = _connectionFactory.CreateConnection();
        var result = await connection.QueryAsync<dynamic>(
            "sp_Users_GetById",
            new { UserId = id },
            commandType: CommandType.StoredProcedure
        );

        var row = result.FirstOrDefault();
        if (row == null) return null;

        var user = new User
        {
            Id = row.UserId,
            Username = row.Username,
            IsActive = row.IsActive,
            CreatedAt = row.CreatedAt,
            PersonId = row.PersonId,
            Person = new Person
            {
                Id = row.PersonId,
                FullName = row.FullName,
                PhoneNumber = row.PhoneNumber,
                Address = row.Address,
                Email = row.Email
            }
        };

        string? roleNamesStr = row.RoleNames;
        if (!string.IsNullOrEmpty(roleNamesStr))
        {
            user.Roles = roleNamesStr.Split(", ")
                .Select(name => new Role { RoleName = name })
                .ToList();
        }

        return user;
    }

    public async Task<User?> GetByUsernameAsync(string username)
    {
        using var connection = _connectionFactory.CreateConnection();
        var result = await connection.QueryAsync<dynamic>(
            "sp_Auth_GetUserByUsername",
            new { Username = username },
            commandType: CommandType.StoredProcedure
        );

        var row = result.FirstOrDefault();
        if (row == null) return null;

        return new User
        {
            Id = row.UserId,
            Username = row.Username,
            PasswordHash = row.PasswordHash,
            IsActive = row.IsActive,
            PersonId = row.PersonId,
            Person = new Person
            {
                Id = row.PersonId,
                FullName = row.FullName
            }
        };
    }

    public async Task<int> CreateAsync(User user, Person person)
    {
        using var connection = _connectionFactory.CreateConnection();
        var parameters = new
        {
            FullName = person.FullName,
            PhoneNumber = person.PhoneNumber,
            Address = person.Address,
            Email = person.Email,
            Username = user.Username,
            PasswordHash = user.PasswordHash,
            CreatedByUserId = user.CreatedByUserId
        };

        var userId = await connection.ExecuteScalarAsync<int>(
            "sp_Users_Create",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return userId;
    }

    public async Task UpdateAsync(User user, Person person)
    {
        using var connection = _connectionFactory.CreateConnection();
        var parameters = new
        {
            UserId = user.Id,
            FullName = person.FullName,
            PhoneNumber = person.PhoneNumber,
            Address = person.Address,
            Email = person.Email,
            IsActive = user.IsActive
        };

        await connection.ExecuteAsync(
            "sp_Users_Update",
            parameters,
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task DeactivateAsync(int id)
    {
        using var connection = _connectionFactory.CreateConnection();
        await connection.ExecuteAsync(
            "sp_Users_Deactivate",
            new { UserId = id },
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<(IEnumerable<User> Users, int TotalCount)> GetAllAsync(int pageNumber, int pageSize, string? searchTerm)
    {
        using var connection = _connectionFactory.CreateConnection();
        var parameters = new DynamicParameters();
        parameters.Add("@PageNumber", pageNumber);
        parameters.Add("@PageSize", pageSize);
        parameters.Add("@SearchTerm", searchTerm);
        parameters.Add("@TotalCount", dbType: DbType.Int32, direction: ParameterDirection.Output);

        var result = await connection.QueryAsync<dynamic>(
            "sp_Users_GetAll",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        var users = result.Select(row =>
        {
            var user = new User
            {
                Id = row.UserId,
                Username = row.Username,
                IsActive = row.IsActive,
                CreatedAt = row.CreatedAt,
                PersonId = row.PersonId,
                Person = new Person
                {
                    Id = row.PersonId,
                    FullName = row.FullName,
                    PhoneNumber = row.PhoneNumber,
                    Address = row.Address,
                    Email = row.Email
                }
            };

            string? roleNamesStr = row.RoleNames;
            if (!string.IsNullOrEmpty(roleNamesStr))
            {
                user.Roles = roleNamesStr.Split(", ")
                    .Select(name => new Role { RoleName = name })
                    .ToList();
            }

            return user;
        }).ToList();

        int totalCount = parameters.Get<int>("@TotalCount");
        return (users, totalCount);
    }

    public async Task UpdatePasswordAsync(int userId, string newPasswordHash, string? ipAddress = null, string? userAgent = null)
    {
        using var connection = _connectionFactory.CreateConnection();
        await connection.ExecuteAsync(
            "sp_Auth_ChangePassword",
            new
            {
                UserId = userId,
                NewPasswordHash = newPasswordHash,
                IpAddress = ipAddress,
                UserAgent = userAgent
            },
            commandType: CommandType.StoredProcedure
        );
    }
}
