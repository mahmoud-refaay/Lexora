using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Lexora.Application.DTOs.User;
using Lexora.Application.Interfaces.Services;
using Lexora.API.Security;

namespace Lexora.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpPost]
    [HasPermission("users.create")]
    public async Task<IActionResult> Create([FromBody] CreateUserDto dto)
    {
        // استخراج معرف المستخدم الحالي الذي يقوم بإنشاء الحساب الجديد
        var currentUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        int? currentUserId = int.TryParse(currentUserIdClaim, out var id) ? id : null;

        var userId = await _userService.CreateAsync(dto, currentUserId);
        return CreatedAtAction(nameof(GetById), new { id = userId }, new { id = userId });
    }

    [HttpGet("{id:int}")]
    [HasPermission("users.view")]
    public async Task<IActionResult> GetById(int id)
    {
        var user = await _userService.GetByIdAsync(id);
        if (user == null)
        {
            return NotFound(new { error = "المستخدم غير موجود." });
        }
        return Ok(user);
    }

    [HttpGet]
    [HasPermission("users.view")]
    public async Task<IActionResult> GetAll(
        [FromQuery] int pageNumber = 1, 
        [FromQuery] int pageSize = 10, 
        [FromQuery] string? searchTerm = null)
    {
        if (pageNumber <= 0) pageNumber = 1;
        if (pageSize <= 0 || pageSize > 100) pageSize = 10;

        var result = await _userService.GetAllAsync(pageNumber, pageSize, searchTerm);
        return Ok(result);
    }

    [HttpPut("{id:int}")]
    [HasPermission("users.edit")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateUserDto dto)
    {
        await _userService.UpdateAsync(id, dto);
        return Ok(new { message = "تم تحديث بيانات المستخدم بنجاح." });
    }

    [HttpDelete("{id:int}")]
    [HasPermission("users.delete")]
    public async Task<IActionResult> Deactivate(int id)
    {
        await _userService.DeactivateAsync(id);
        return Ok(new { message = "تم تعطيل حساب المستخدم بنجاح." });
    }
}
