using System.Data;
using Dapper;
using Lexora.Application.Interfaces.Repositories;
using Lexora.Domain.Exceptions;
using Microsoft.Data.SqlClient;

namespace Lexora.Infrastructure.Data.Repositories.Clients;

public class ClientRepository : IClientRepository
{
    private readonly DbConnectionFactory _connectionFactory;

    public ClientRepository(DbConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<Client?> GetByIdAsync(int id)
    {
        try
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<Client>(
                "sp_Clients_GetById",
                new { ClientId = id },
                commandType: CommandType.StoredProcedure
            );
        }
        catch (SqlException ex) when (ex.Number >= 50000)
        {
            throw new DomainException(ex.Message, ex);
        }
    }

    public async Task<int> CreateAsync(Client client)
    {
        try
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new
            {
                ClientType = client.ClientType,
                FullName = client.FullName,
                NationalId = client.NationalId,
                PhoneNumber = client.PhoneNumber,
                Email = client.Email,
                Address = client.Address,
                Notes = client.Notes,
                CreatedByUserId = client.CreatedByUserId
            };

            return await connection.ExecuteScalarAsync<int>(
                "sp_Clients_Create",
                parameters,
                commandType: CommandType.StoredProcedure
            );
        }
        catch (SqlException ex) when (ex.Number >= 50000)
        {
            throw new DomainException(ex.Message, ex);
        }
    }

    public async Task UpdateAsync(Client client)
    {
        try
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new
            {
                ClientId = client.Id,
                ClientType = client.ClientType,
                FullName = client.FullName,
                NationalId = client.NationalId,
                PhoneNumber = client.PhoneNumber,
                Email = client.Email,
                Address = client.Address,
                Notes = client.Notes,
                Status = client.Status,
                UpdatedByUserId = client.UpdatedByUserId
            };

            await connection.ExecuteAsync(
                "sp_Clients_Update",
                parameters,
                commandType: CommandType.StoredProcedure
            );
        }
        catch (SqlException ex) when (ex.Number >= 50000)
        {
            throw new DomainException(ex.Message, ex);
        }
    }

    public async Task DeleteAsync(int id, int? deletedByUserId)
    {
        try
        {
            using var connection = _connectionFactory.CreateConnection();
            await connection.ExecuteAsync(
                "sp_Clients_Delete",
                new { ClientId = id, DeletedByUserId = deletedByUserId },
                commandType: CommandType.StoredProcedure
            );
        }
        catch (SqlException ex) when (ex.Number >= 50000)
        {
            throw new DomainException(ex.Message, ex);
        }
    }

    public async Task<(IEnumerable<Client> Clients, int TotalCount)> GetAllAsync(int pageNumber, int pageSize, string? searchTerm, string? status)
    {
        try
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@PageNumber", pageNumber);
            parameters.Add("@PageSize", pageSize);
            parameters.Add("@SearchTerm", searchTerm);
            parameters.Add("@Status", status);
            parameters.Add("@TotalCount", dbType: DbType.Int32, direction: ParameterDirection.Output);

            var result = await connection.QueryAsync<Client>(
                "sp_Clients_GetAll",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            int totalCount = parameters.Get<int>("@TotalCount");
            return (result, totalCount);
        }
        catch (SqlException ex) when (ex.Number >= 50000)
        {
            throw new DomainException(ex.Message, ex);
        }
    }

    public async Task<IEnumerable<ConflictResult>> CheckConflictAsync(string name)
    {
        try
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<ConflictResult>(
                "sp_Clients_CheckConflict",
                new { SearchName = name },
                commandType: CommandType.StoredProcedure
            );
        }
        catch (SqlException ex) when (ex.Number >= 50000)
        {
            throw new DomainException(ex.Message, ex);
        }
    }
}
