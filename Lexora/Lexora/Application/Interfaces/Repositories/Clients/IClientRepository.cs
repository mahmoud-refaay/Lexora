namespace Lexora.Application.Interfaces.Repositories.Clients;

public interface IClientRepository
{
    Task<Client?> GetByIdAsync(int id);
    Task<int> CreateAsync(Client client);
    Task UpdateAsync(Client client);
    Task DeleteAsync(int id, int? deletedByUserId);
    Task<(IEnumerable<Client> Clients, int TotalCount)> GetAllAsync(int pageNumber, int pageSize, string? searchTerm, string? status);
    Task<IEnumerable<ConflictResult>> CheckConflictAsync(string name);
}
