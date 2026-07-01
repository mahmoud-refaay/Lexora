using Lexora.Domain.Entities;

namespace Lexora.Application.Interfaces.Repositories.Identity;

public interface IRoleRepository
{
    Task<IEnumerable<Role>> GetAllRolesAsync();
    Task<Role?> GetRoleByIdAsync(int id);
    Task AssignRoleAsync(int userId, int roleId, int? assignedByUserId = null);
    Task RemoveRoleAsync(int userId, int roleId);
    Task<IEnumerable<Role>> GetRolesByUserIdAsync(int userId);
    Task<IEnumerable<Permission>> GetPermissionsByRoleIdAsync(int roleId);
    Task<IEnumerable<Permission>> GetAllPermissionsAsync();
    Task<IEnumerable<string>> GetUserPermissionsAsync(int userId);
}
