namespace Lexora.Application.Interfaces.Repositories.Cases;

public interface ICaseNoteRepository
{
    Task<CaseNote?> GetByIdAsync(int id);
    Task<int> CreateAsync(CaseNote note);
    Task<IEnumerable<CaseNote>> GetByCaseIdAsync(int caseId);
    Task DeleteAsync(int id, int? deletedByUserId);
}
