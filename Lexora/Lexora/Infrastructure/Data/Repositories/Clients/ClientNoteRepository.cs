using System.Data;
using Dapper;
using Lexora.Application.Interfaces.Repositories;
using Lexora.Domain.Exceptions;
using Microsoft.Data.SqlClient;

namespace Lexora.Infrastructure.Data.Repositories.Clients;

public class ClientNoteRepository : IClientNoteRepository
{
    private readonly DbConnectionFactory _connectionFactory;

    public ClientNoteRepository(DbConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<int> CreateAsync(ClientNote note)
    {
        try
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new
            {
                ClientId = note.ClientId,
                Note = note.Note,
                CreatedByUserId = note.CreatedByUserId
            };

            return await connection.ExecuteScalarAsync<int>(
                "sp_ClientNotes_Create",
                parameters,
                commandType: CommandType.StoredProcedure
            );
        }
        catch (SqlException ex) when (ex.Number >= 50000)
        {
            throw new DomainException(ex.Message, ex);
        }
    }

    public async Task<IEnumerable<ClientNote>> GetByClientIdAsync(int clientId)
    {
        try
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<ClientNote>(
                "sp_ClientNotes_GetByClientId",
                new { ClientId = clientId },
                commandType: CommandType.StoredProcedure
            );
        }
        catch (SqlException ex) when (ex.Number >= 50000)
        {
            throw new DomainException(ex.Message, ex);
        }
    }

    public async Task DeleteAsync(int noteId)
    {
        try
        {
            using var connection = _connectionFactory.CreateConnection();
            await connection.ExecuteAsync(
                "sp_ClientNotes_Delete",
                new { NoteId = noteId },
                commandType: CommandType.StoredProcedure
            );
        }
        catch (SqlException ex) when (ex.Number >= 50000)
        {
            throw new DomainException(ex.Message, ex);
        }
    }

    public async Task<ClientNote?> GetByIdAsync(int noteId)
    {
        try
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<ClientNote>(
                "sp_ClientNotes_GetById",
                new { NoteId = noteId },
                commandType: CommandType.StoredProcedure
            );
        }
        catch (SqlException ex) when (ex.Number >= 50000)
        {
            throw new DomainException(ex.Message, ex);
        }
    }
}
