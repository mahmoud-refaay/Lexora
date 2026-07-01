using System.Security.Claims;
using Lexora.API.Security;
using Lexora.Application.DTOs.Cases;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Lexora.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CasesController : ControllerBase
{
    private readonly ICaseService _caseService;

    public CasesController(ICaseService caseService)
    {
        _caseService = caseService;
    }

    [HttpPost]
    [HasPermission("cases.create")]
    public async Task<IActionResult> Create([FromBody] CreateCaseDto dto)
    {
        var currentUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        int? currentUserId = int.TryParse(currentUserIdClaim, out var userId) ? userId : null;

        var caseId = await _caseService.CreateAsync(dto, currentUserId);
        return CreatedAtAction(nameof(GetById), new { id = caseId }, new { caseId = caseId, message = "تم إنشاء القضية بنجاح." });
    }

    [HttpGet("{id:int}")]
    [HasPermission("cases.view")]
    public async Task<IActionResult> GetById(int id)
    {
        var @case = await _caseService.GetByIdAsync(id);
        if (@case == null)
        {
            return NotFound(new { error = "القضية المطلوبة غير موجودة في النظام." });
        }
        return Ok(@case);
    }

    [HttpGet]
    [HasPermission("cases.view")]
    public async Task<IActionResult> GetAll(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] int? clientId = null,
        [FromQuery] int? assignedLawyerId = null,
        [FromQuery] string? status = null,
        [FromQuery] bool? isArchived = null,
        [FromQuery] string? searchTerm = null)
    {
        if (pageNumber <= 0) pageNumber = 1;
        if (pageSize <= 0 || pageSize > 100) pageSize = 10;

        var result = await _caseService.GetAllAsync(pageNumber, pageSize, clientId, assignedLawyerId, status, isArchived, searchTerm);
        return Ok(result);
    }

    [HttpPut("{id:int}")]
    [HasPermission("cases.edit")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateCaseDto dto)
    {
        var currentUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        int? currentUserId = int.TryParse(currentUserIdClaim, out var userId) ? userId : null;

        await _caseService.UpdateAsync(id, dto, currentUserId);
        return Ok(new { message = "تم تعديل القضية بنجاح." });
    }

    [HttpDelete("{id:int}")]
    [HasPermission("cases.delete")]
    public async Task<IActionResult> Delete(int id)
    {
        var currentUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        int? currentUserId = int.TryParse(currentUserIdClaim, out var userId) ? userId : null;

        await _caseService.DeleteAsync(id, currentUserId);
        return Ok(new { message = "تم حذف القضية بنجاح." });
    }

    [HttpPut("{id:int}/archive")]
    [HasPermission("cases.edit")]
    public async Task<IActionResult> Archive(int id, [FromQuery] bool isArchived = true)
    {
        var currentUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        int? currentUserId = int.TryParse(currentUserIdClaim, out var userId) ? userId : null;

        await _caseService.ArchiveAsync(id, currentUserId, isArchived);
        var actionText = isArchived ? "أرشفة" : "إلغاء أرشفة";
        return Ok(new { message = $"تم {actionText} القضية بنجاح." });
    }

    // ================================================
    // الملاحظات (Notes Endpoints)
    // ================================================

    [HttpPost("{id:int}/notes")]
    [HasPermission("cases.edit")]
    public async Task<IActionResult> AddNote(int id, [FromBody] CreateCaseNoteDto dto)
    {
        var currentUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        int? currentUserId = int.TryParse(currentUserIdClaim, out var userId) ? userId : null;

        var noteId = await _caseService.AddNoteAsync(id, dto, currentUserId);
        return Ok(new { noteId = noteId, message = "تمت إضافة الملاحظة بنجاح للقضية." });
    }

    [HttpGet("{id:int}/notes")]
    [HasPermission("cases.view")]
    public async Task<IActionResult> GetNotes(int id)
    {
        var notes = await _caseService.GetNotesAsync(id);
        return Ok(notes);
    }

    [HttpDelete("{id:int}/notes/{noteId:int}")]
    [HasPermission("cases.edit")]
    public async Task<IActionResult> DeleteNote(int id, int noteId)
    {
        var currentUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        int? currentUserId = int.TryParse(currentUserIdClaim, out var userId) ? userId : null;

        await _caseService.DeleteNoteAsync(noteId, currentUserId);
        return Ok(new { message = "تم حذف الملاحظة بنجاح." });
    }
}
