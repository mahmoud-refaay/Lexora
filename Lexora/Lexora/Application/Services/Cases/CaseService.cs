using Lexora.Application.DTOs.Common;
using Lexora.Application.DTOs.Cases;
using Lexora.Application.Interfaces.Services.Cases;
using Lexora.Application.Interfaces.Repositories.Cases;
using Lexora.Domain.Exceptions;

namespace Lexora.Application.Services.Cases;

public class CaseService : ICaseService
{
    private readonly ICaseRepository _caseRepository;
    private readonly ICaseNoteRepository _caseNoteRepository;

    public CaseService(ICaseRepository caseRepository, ICaseNoteRepository caseNoteRepository)
    {
        _caseRepository = caseRepository;
        _caseNoteRepository = caseNoteRepository;
    }

    public async Task<int> CreateAsync(CreateCaseDto dto, int? createdByUserId = null)
    {
        if (dto == null) throw new ArgumentNullException(nameof(dto));

        var @case = new Case
        {
            ClientId = dto.ClientId,
            ParentCaseId = dto.ParentCaseId,
            AssignedLawyerId = dto.AssignedLawyerId,
            CaseNumber = dto.CaseNumber?.Trim(),
            CaseYear = dto.CaseYear,
            CaseType = dto.CaseType?.Trim(),
            CourtName = dto.CourtName?.Trim(),
            CourtCircuit = dto.CourtCircuit?.Trim(),
            ClientRole = dto.ClientRole.Trim(),
            OpponentName = dto.OpponentName?.Trim(),
            OpponentLawyer = dto.OpponentLawyer?.Trim(),
            Subject = dto.Subject?.Trim(),
            Status = dto.Status.Trim(),
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            CreatedByUserId = createdByUserId
        };

        return await _caseRepository.CreateAsync(@case);
    }

    public async Task<CaseDto?> GetByIdAsync(int id)
    {
        var @case = await _caseRepository.GetByIdAsync(id);
        if (@case == null) return null;

        return MapToDto(@case);
    }

    public async Task<PaginatedResult<CaseDto>> GetAllAsync(
        int pageNumber, 
        int pageSize, 
        int? clientId = null, 
        int? assignedLawyerId = null, 
        string? status = null, 
        bool? isArchived = null, 
        string? searchTerm = null)
    {
        var (cases, totalCount) = await _caseRepository.GetAllAsync(
            pageNumber, 
            pageSize, 
            clientId, 
            assignedLawyerId, 
            status?.Trim(), 
            isArchived, 
            searchTerm?.Trim()
        );

        var dtos = cases.Select(MapToDto);
        return new PaginatedResult<CaseDto>
        {
            Items = dtos,
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
    }

    public async Task UpdateAsync(int id, UpdateCaseDto dto, int? updatedByUserId = null)
    {
        if (dto == null) throw new ArgumentNullException(nameof(dto));

        var existingCase = await _caseRepository.GetByIdAsync(id);
        if (existingCase == null)
        {
            throw new DomainException("القضية المطلوبة غير موجودة في النظام.");
        }

        existingCase.ClientId = dto.ClientId;
        existingCase.ParentCaseId = dto.ParentCaseId;
        existingCase.AssignedLawyerId = dto.AssignedLawyerId;
        existingCase.CaseNumber = dto.CaseNumber?.Trim();
        existingCase.CaseYear = dto.CaseYear;
        existingCase.CaseType = dto.CaseType?.Trim();
        existingCase.CourtName = dto.CourtName?.Trim();
        existingCase.CourtCircuit = dto.CourtCircuit?.Trim();
        existingCase.ClientRole = dto.ClientRole.Trim();
        existingCase.OpponentName = dto.OpponentName?.Trim();
        existingCase.OpponentLawyer = dto.OpponentLawyer?.Trim();
        existingCase.Subject = dto.Subject?.Trim();
        existingCase.Status = dto.Status.Trim();
        existingCase.StartDate = dto.StartDate;
        existingCase.EndDate = dto.EndDate;
        existingCase.UpdatedByUserId = updatedByUserId;

        await _caseRepository.UpdateAsync(existingCase);
    }

    public async Task DeleteAsync(int id, int? deletedByUserId = null)
    {
        await _caseRepository.DeleteAsync(id, deletedByUserId);
    }

    public async Task ArchiveAsync(int id, int? archivedByUserId = null, bool isArchived = true)
    {
        await _caseRepository.ArchiveAsync(id, archivedByUserId, isArchived);
    }

    // ============================================================================
    // Mappings and Notes Operations
    // ============================================================================

    public async Task<int> AddNoteAsync(int caseId, CreateCaseNoteDto dto, int? createdByUserId = null)
    {
        if (dto == null) throw new ArgumentNullException(nameof(dto));
        if (string.IsNullOrWhiteSpace(dto.Note))
        {
            throw new DomainException("نص الملاحظة لا يمكن أن يكون فارغاً.");
        }

        var note = new CaseNote
        {
            CaseId = caseId,
            Note = dto.Note.Trim(),
            CreatedByUserId = createdByUserId
        };

        return await _caseNoteRepository.CreateAsync(note);
    }

    public async Task<IEnumerable<CaseNoteDto>> GetNotesAsync(int caseId)
    {
        var notes = await _caseNoteRepository.GetByCaseIdAsync(caseId);
        return notes.Select(MapNoteToDto);
    }

    public async Task DeleteNoteAsync(int noteId, int? userId = null)
    {
        await _caseNoteRepository.DeleteAsync(noteId, userId);
    }

    private static CaseDto MapToDto(Case @case)
    {
        return new CaseDto
        {
            Id = @case.Id,
            ClientId = @case.ClientId,
            ClientName = @case.ClientName,
            ClientPhone = @case.ClientPhone,
            ParentCaseId = @case.ParentCaseId,
            ParentCaseNumber = @case.ParentCaseNumber,
            AssignedLawyerId = @case.AssignedLawyerId,
            AssignedLawyerName = @case.AssignedLawyerName,
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
            IsArchived = @case.IsArchived,
            CreatedAt = @case.CreatedAt,
            CreatedByUserId = @case.CreatedByUserId,
            UpdatedAt = @case.UpdatedAt,
            UpdatedByUserId = @case.UpdatedByUserId,
            ArchivedAt = @case.ArchivedAt,
            ArchivedByUserId = @case.ArchivedByUserId
        };
    }

    private static CaseNoteDto MapNoteToDto(CaseNote note)
    {
        return new CaseNoteDto
        {
            Id = note.Id,
            CaseId = note.CaseId,
            Note = note.Note,
            CreatedAt = note.CreatedAt,
            CreatedByUserId = note.CreatedByUserId,
            AuthorName = note.AuthorName,
            UpdatedAt = note.UpdatedAt,
            UpdatedByUserId = note.UpdatedByUserId
        };
    }
}
