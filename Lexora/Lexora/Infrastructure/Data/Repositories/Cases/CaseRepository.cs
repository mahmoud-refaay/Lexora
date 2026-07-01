using System.Data;
using Dapper;
using Lexora.Application.Interfaces.Repositories.Cases;
using Lexora.Domain.Exceptions;
using Microsoft.Data.SqlClient;

namespace Lexora.Infrastructure.Data.Repositories.Cases;

public class CaseRepository : ICaseRepository
{
    private readonly DbConnectionFactory _connectionFactory;

    public CaseRepository(DbConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<Case?> GetByIdAsync(int id)
    {
        try
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<Case>(
                "sp_Cases_GetById",
                new { CaseId = id },
                commandType: CommandType.StoredProcedure
            );
        }
        catch (SqlException ex) when (ex.Number >= 50000)
        {
            throw new DomainException(ex.Message, ex);
        }
    }

    public async Task<int> CreateAsync(Case @case)
    {
        try
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@ClientId", @case.ClientId);
            parameters.Add("@ParentCaseId", @case.ParentCaseId);
            parameters.Add("@AssignedLawyerId", @case.AssignedLawyerId);
            parameters.Add("@CaseNumber", @case.CaseNumber);
            parameters.Add("@CaseYear", @case.CaseYear);
            parameters.Add("@CaseType", @case.CaseType);
            parameters.Add("@CourtName", @case.CourtName);
            parameters.Add("@CourtCircuit", @case.CourtCircuit);
            parameters.Add("@ClientRole", @case.ClientRole);
            parameters.Add("@OpponentName", @case.OpponentName);
            parameters.Add("@OpponentLawyer", @case.OpponentLawyer);
            parameters.Add("@Subject", @case.Subject);
            parameters.Add("@Status", @case.Status);
            parameters.Add("@StartDate", @case.StartDate);
            parameters.Add("@EndDate", @case.EndDate);
            parameters.Add("@CreatedByUserId", @case.CreatedByUserId);
            parameters.Add("@CaseId", dbType: DbType.Int32, direction: ParameterDirection.Output);

            await connection.ExecuteAsync(
                "sp_Cases_Create",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            return parameters.Get<int>("@CaseId");
        }
        catch (SqlException ex) when (ex.Number >= 50000)
        {
            throw new DomainException(ex.Message, ex);
        }
    }

    public async Task UpdateAsync(Case @case)
    {
        try
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new
            {
                CaseId = @case.Id,
                ClientId = @case.ClientId,
                ParentCaseId = @case.ParentCaseId,
                AssignedLawyerId = @case.AssignedLawyerId,
                CaseNumber = @case.CaseNumber,
                CaseYear = @case.CaseYear,
                CaseType = @case.CaseType,
                CourtName = @case.CourtName,
                CourtCircuit = @case.CourtCircuit,
                ClientRole = @case.ClientRole,
                OpponentName = @case.OpponentName,
                OpponentLawyer = @case.OpponentLawyer,
                Subject = @case.Subject,
                Status = @case.Status,
                StartDate = @case.StartDate,
                EndDate = @case.EndDate,
                UpdatedByUserId = @case.UpdatedByUserId
            };

            await connection.ExecuteAsync(
                "sp_Cases_Update",
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
                "sp_Cases_Delete",
                new { CaseId = id, DeletedByUserId = deletedByUserId },
                commandType: CommandType.StoredProcedure
            );
        }
        catch (SqlException ex) when (ex.Number >= 50000)
        {
            throw new DomainException(ex.Message, ex);
        }
    }

    public async Task ArchiveAsync(int id, int? archivedByUserId, bool isArchived)
    {
        try
        {
            using var connection = _connectionFactory.CreateConnection();
            await connection.ExecuteAsync(
                "sp_Cases_Archive",
                new { CaseId = id, ArchivedByUserId = archivedByUserId, IsArchived = isArchived },
                commandType: CommandType.StoredProcedure
            );
        }
        catch (SqlException ex) when (ex.Number >= 50000)
        {
            throw new DomainException(ex.Message, ex);
        }
    }

    public async Task<(IEnumerable<Case> Cases, int TotalCount)> GetAllAsync(
        int pageNumber, 
        int pageSize, 
        int? clientId, 
        int? assignedLawyerId, 
        string? status, 
        bool? isArchived, 
        string? searchTerm)
    {
        try
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@PageNumber", pageNumber);
            parameters.Add("@PageSize", pageSize);
            parameters.Add("@ClientId", clientId);
            parameters.Add("@AssignedLawyerId", assignedLawyerId);
            parameters.Add("@Status", status);
            parameters.Add("@IsArchived", isArchived);
            parameters.Add("@SearchTerm", searchTerm);
            parameters.Add("@TotalCount", dbType: DbType.Int32, direction: ParameterDirection.Output);

            var result = await connection.QueryAsync<Case>(
                "sp_Cases_GetAll",
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
}
