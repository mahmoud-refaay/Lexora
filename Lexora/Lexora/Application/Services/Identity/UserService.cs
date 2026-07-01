using Lexora.Application.DTOs.Common;
using Lexora.Application.DTOs.User;
using Lexora.Application.Interfaces.Repositories;
using Lexora.Application.Interfaces.Security;
using Lexora.Application.Interfaces.Services;
using Lexora.Domain.Entities;
using Lexora.Domain.Exceptions;

namespace Lexora.Application.Services.Identity;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IRoleRepository _roleRepository;
    private readonly IPasswordHasher _passwordHasher;

    public UserService(
        IUserRepository userRepository,
        IRoleRepository roleRepository,
        IPasswordHasher passwordHasher)
    {
        _userRepository = userRepository;
        _roleRepository = roleRepository;
        _passwordHasher = passwordHasher;
    }

    public async Task<int> CreateAsync(CreateUserDto dto, int? createdByUserId = null)
    {
        // 0. التحقق من قوة كلمة المرور
        PasswordValidator.Validate(dto.Password);

        // 1. تشفير كلمة المرور قبل الحفظ
        var passwordHash = _passwordHasher.Hash(dto.Password);

        // 2. تجهيز كائنات الـ Domain
        var person = new Person
        {
            FullName = dto.FullName,
            PhoneNumber = dto.PhoneNumber,
            Address = dto.Address,
            Email = dto.Email
        };

        var user = new User
        {
            Username = dto.Username,
            PasswordHash = passwordHash,
            CreatedByUserId = createdByUserId
        };

        // 3. حفظ المستخدم في قاعدة البيانات
        var userId = await _userRepository.CreateAsync(user, person);

        // 4. إسناد الأدوار للمستخدم الجديد
        foreach (var roleId in dto.RoleIds)
        {
            await _roleRepository.AssignRoleAsync(userId, roleId, createdByUserId);
        }

        return userId;
    }

    public async Task<UserDto?> GetByIdAsync(int id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null) return null;

        return MapToDto(user);
    }

    public async Task<PaginatedResult<UserDto>> GetAllAsync(int pageNumber, int pageSize, string? searchTerm = null)
    {
        var (users, totalCount) = await _userRepository.GetAllAsync(pageNumber, pageSize, searchTerm);

        return new PaginatedResult<UserDto>
        {
            Items = users.Select(MapToDto),
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
    }

    public async Task UpdateAsync(int id, UpdateUserDto dto)
    {
        // 1. التحقق من وجود المستخدم
        var existingUser = await _userRepository.GetByIdAsync(id);
        if (existingUser == null)
        {
            throw new DomainException("المستخدم المطلوب تحديثه غير موجود في النظام.");
        }

        // 2. تحديث بيانات الشخص والمستخدم
        var person = new Person
        {
            FullName = dto.FullName,
            PhoneNumber = dto.PhoneNumber,
            Address = dto.Address,
            Email = dto.Email
        };

        var user = new User
        {
            Id = id,
            IsActive = dto.IsActive
        };

        await _userRepository.UpdateAsync(user, person);

        // 3. تحديث الأدوار: حذف القديمة وإضافة الجديدة
        var currentRoles = await _roleRepository.GetRolesByUserIdAsync(id);
        var currentRoleIds = currentRoles.Select(r => r.Id).ToHashSet();
        var newRoleIds = dto.RoleIds.ToHashSet();

        // حذف الأدوار التي لم تعد موجودة في القائمة الجديدة
        foreach (var roleId in currentRoleIds.Except(newRoleIds))
        {
            await _roleRepository.RemoveRoleAsync(id, roleId);
        }

        // إضافة الأدوار الجديدة التي لم تكن موجودة
        foreach (var roleId in newRoleIds.Except(currentRoleIds))
        {
            await _roleRepository.AssignRoleAsync(id, roleId);
        }
    }

    public async Task DeactivateAsync(int id)
    {
        await _userRepository.DeactivateAsync(id);
    }

    // ================================================
    // تحويل كائن الـ Domain إلى DTO للإرجاع للعميل
    // ================================================
    private static UserDto MapToDto(User user)
    {
        return new UserDto
        {
            Id = user.Id,
            PersonId = user.PersonId,
            Username = user.Username,
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt,
            FullName = user.Person?.FullName ?? string.Empty,
            PhoneNumber = user.Person?.PhoneNumber,
            Address = user.Person?.Address,
            Email = user.Person?.Email,
            RoleNames = user.Roles.Any()
                ? string.Join(", ", user.Roles.Select(r => r.RoleName))
                : null
        };
    }
}
