using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Lexora.Application.DTOs.Clients;
using Lexora.Application.Interfaces.Services;
using Lexora.API.Security;

namespace Lexora.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ClientsController : ControllerBase
{
    private readonly IClientService _clientService;

    public ClientsController(IClientService clientService)
    {
        _clientService = clientService;
    }

    [HttpPost]
    [HasPermission("clients.create")]
    public async Task<IActionResult> Create([FromBody] CreateClientDto dto)
    {
        var currentUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        int? currentUserId = int.TryParse(currentUserIdClaim, out var id) ? id : null;

        var clientId = await _clientService.CreateAsync(dto, currentUserId);
        return CreatedAtAction(nameof(GetById), new { id = clientId }, new { id = clientId });
    }

    [HttpGet("{id:int}")]
    [HasPermission("clients.view")]
    public async Task<IActionResult> GetById(int id)
    {
        var client = await _clientService.GetByIdAsync(id);
        if (client == null)
        {
            return NotFound(new { error = "العميل غير موجود في النظام." });
        }
        return Ok(client);
    }

    [HttpGet]
    [HasPermission("clients.view")]
    public async Task<IActionResult> GetAll(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? searchTerm = null,
        [FromQuery] string? status = null)
    {
        if (pageNumber <= 0) pageNumber = 1;
        if (pageSize <= 0 || pageSize > 100) pageSize = 10;

        var result = await _clientService.GetAllAsync(pageNumber, pageSize, searchTerm, status);
        return Ok(result);
    }

    [HttpGet("conflict-check")]
    [HasPermission("clients.view")]
    public async Task<IActionResult> CheckConflict([FromQuery] string name)
    {
        var result = await _clientService.CheckConflictAsync(name);
        return Ok(result);
    }

    [HttpPut("{id:int}")]
    [HasPermission("clients.edit")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateClientDto dto)
    {
        var currentUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        int? currentUserId = int.TryParse(currentUserIdClaim, out var userId) ? userId : null;

        await _clientService.UpdateAsync(id, dto, currentUserId);
        return Ok(new { message = "تم تحديث بيانات العميل بنجاح." });
    }

    [HttpDelete("{id:int}")]
    [HasPermission("clients.delete")]
    public async Task<IActionResult> Delete(int id)
    {
        var currentUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        int? currentUserId = int.TryParse(currentUserIdClaim, out var userId) ? userId : null;

        await _clientService.DeleteAsync(id, currentUserId);
        return Ok(new { message = "تم حذف العميل بنجاح." });
    }

    // ================================================
    // الملاحظات (Notes Endpoints)
    // ================================================

    [HttpPost("{id:int}/notes")]
    [HasPermission("clients.edit")] // ربط الملاحظات بصلاحيات التعديل
    public async Task<IActionResult> AddNote(int id, [FromBody] CreateClientNoteDto dto)
    {
        var currentUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        int? currentUserId = int.TryParse(currentUserIdClaim, out var userId) ? userId : null;

        var noteId = await _clientService.AddNoteAsync(id, dto, currentUserId);
        return Ok(new { noteId = noteId, message = "تمت إضافة الملاحظة بنجاح." });
    }

    [HttpGet("{id:int}/notes")]
    [HasPermission("clients.view")]
    public async Task<IActionResult> GetNotes(int id)
    {
        var notes = await _clientService.GetNotesAsync(id);
        return Ok(notes);
    }

    [HttpDelete("{id:int}/notes/{noteId:int}")]
    [HasPermission("clients.edit")]
    public async Task<IActionResult> DeleteNote(int id, int noteId)
    {
        var currentUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        int? currentUserId = int.TryParse(currentUserIdClaim, out var userId) ? userId : null;

        await _clientService.DeleteNoteAsync(noteId, currentUserId);
        return Ok(new { message = "تم حذف الملاحظة بنجاح." });
    }
}
