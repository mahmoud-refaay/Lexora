using System.Data;
using Dapper;
using Lexora.Application.Interfaces.Repositories.Cases;
using Lexora.Domain.Exceptions;
using Microsoft.Data.SqlClient;

namespace Lexora.Infrastructure.Data.Repositories.Cases;

public class CaseNoteRepository : ICaseNoteRepository
{
    private readonly DbConnectionFactory _connectionFactory;

    public CaseNoteRepository(DbConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<CaseNote?> GetByIdAsync(int id)
    {
        try
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<CaseNote>(
                "sp_CaseNotes_GetById",
                new { NoteId = id },
                commandType: CommandType.StoredProcedure
            );
        }
        catch (SqlException ex) when (ex.Number >= 50000)
        {
            throw new DomainException(ex.Message, ex);
        }
    }

    public async Task<int> CreateAsync(CaseNote note)
    {
        try
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@CaseId", note.CaseId);
            parameters.Add("@Note", note.Note);
            parameters.Add("@CreatedByUserId", note.CreatedByUserId);
            parameters.Add("@NoteId", dbType: DbType.Int32, direction: ParameterDirection.Output);

            await connection.ExecuteAsync(
                "sp_CaseNotes_Create",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            return parameters.Get<int>("@NoteId");
        }
        catch (SqlException ex) when (ex.Number >= 50000)
        {
            throw new DomainException(ex.Message, ex);
        }
    }

    public async Task<IEnumerable<CaseNote>> GetByCaseIdAsync(int caseId)
    {
        try
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<CaseNote>(
                "sp_CaseNotes_GetByCaseId",
                new { CaseId = caseId },
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
                "sp_CaseNotes_Delete",
                new { NoteId = id, DeletedByUserId = deletedByUserId },
                commandType: CommandType.StoredProcedure
            );
        }
        catch (SqlException ex) when (ex.Number >= 50000)
        {
            throw new DomainException(ex.Message, ex);
        }
    }
}
