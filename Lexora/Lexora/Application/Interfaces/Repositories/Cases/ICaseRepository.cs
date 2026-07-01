namespace Lexora.Application.Interfaces.Repositories.Cases;

public interface ICaseRepository
{
    Task<Case?> GetByIdAsync(int id);
    Task<int> CreateAsync(Case @case);
    Task UpdateAsync(Case @case);
    Task DeleteAsync(int id, int? deletedByUserId);
    Task ArchiveAsync(int id, int? archivedByUserId, bool isArchived);
    Task<(IEnumerable<Case> Cases, int TotalCount)> GetAllAsync(
        int pageNumber, 
        int pageSize, 
        int? clientId, 
        int? assignedLawyerId, 
        string? status, 
        bool? isArchived, 
        string? searchTerm);
}
