namespace Lexora.Application.Interfaces.Repositories.Clients;

public interface IClientNoteRepository
{
    Task<int> CreateAsync(ClientNote note);
    Task<IEnumerable<ClientNote>> GetByClientIdAsync(int clientId);
    Task DeleteAsync(int noteId);
    Task<ClientNote?> GetByIdAsync(int noteId);
}
