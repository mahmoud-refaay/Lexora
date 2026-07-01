using Lexora.Domain.Entities;

namespace Lexora.Application.Interfaces.Repositories.Identity;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(int id);
    Task<User?> GetByUsernameAsync(string username);
    Task<int> CreateAsync(User user, Person person);
    Task UpdateAsync(User user, Person person);
    Task DeactivateAsync(int id);
    Task<(IEnumerable<User> Users, int TotalCount)> GetAllAsync(int pageNumber, int pageSize, string? searchTerm);
    Task UpdatePasswordAsync(int userId, string newPasswordHash, string? ipAddress = null, string? userAgent = null);
}
