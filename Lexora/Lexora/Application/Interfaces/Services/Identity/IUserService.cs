using Lexora.Application.DTOs.Common;
using Lexora.Application.DTOs.User;

namespace Lexora.Application.Interfaces.Services.Identity;

public interface IUserService
{
    Task<int> CreateAsync(CreateUserDto dto, int? createdByUserId = null);
    Task<UserDto?> GetByIdAsync(int id);
    Task<PaginatedResult<UserDto>> GetAllAsync(int pageNumber, int pageSize, string? searchTerm = null);
    Task UpdateAsync(int id, UpdateUserDto dto);
    Task DeactivateAsync(int id);
}
