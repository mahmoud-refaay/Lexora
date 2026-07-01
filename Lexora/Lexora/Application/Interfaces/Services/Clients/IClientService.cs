using Lexora.Application.DTOs.Common;
using Lexora.Application.DTOs.Clients;

namespace Lexora.Application.Interfaces.Services.Clients;

public interface IClientService
{
    Task<int> CreateAsync(CreateClientDto dto, int? createdByUserId = null);
    Task<ClientDto?> GetByIdAsync(int id);
    Task<PaginatedResult<ClientDto>> GetAllAsync(int pageNumber, int pageSize, string? searchTerm = null, string? status = null);
    Task UpdateAsync(int id, UpdateClientDto dto, int? updatedByUserId = null);
    Task DeleteAsync(int id, int? deletedByUserId = null);

    // Note operations
    Task<int> AddNoteAsync(int clientId, CreateClientNoteDto dto, int? createdByUserId = null);
    Task<IEnumerable<ClientNoteDto>> GetNotesAsync(int clientId);
    Task DeleteNoteAsync(int noteId, int? userId = null);

    // Conflict Check
    Task<IEnumerable<ConflictResultDto>> CheckConflictAsync(string name);
}
