using Lexora.Application.DTOs.Common;
using Lexora.Application.DTOs.Cases;

namespace Lexora.Application.Interfaces.Services.Cases;

public interface ICaseService
{
    Task<int> CreateAsync(CreateCaseDto dto, int? createdByUserId = null);
    Task<CaseDto?> GetByIdAsync(int id);
    Task<PaginatedResult<CaseDto>> GetAllAsync(
        int pageNumber, 
        int pageSize, 
        int? clientId = null, 
        int? assignedLawyerId = null, 
        string? status = null, 
        bool? isArchived = null, 
        string? searchTerm = null);
    Task UpdateAsync(int id, UpdateCaseDto dto, int? updatedByUserId = null);
    Task DeleteAsync(int id, int? deletedByUserId = null);
    Task ArchiveAsync(int id, int? archivedByUserId = null, bool isArchived = true);

    // Note operations
    Task<int> AddNoteAsync(int caseId, CreateCaseNoteDto dto, int? createdByUserId = null);
    Task<IEnumerable<CaseNoteDto>> GetNotesAsync(int caseId);
    Task DeleteNoteAsync(int noteId, int? userId = null);
}
