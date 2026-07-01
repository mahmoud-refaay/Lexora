using Lexora.Domain.Entities;

namespace Lexora.Application.Interfaces.Repositories.Settings;

public interface ISettingRepository
{
    Task<IEnumerable<Setting>> GetAllAsync();
    Task<Setting?> GetByKeyAsync(string key);
    Task UpdateAsync(string key, string? value, int? updatedByUserId = null);
}
