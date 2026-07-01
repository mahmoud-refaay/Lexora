using System.ComponentModel.DataAnnotations;

namespace Lexora.Application.DTOs.Cases;

public class CreateCaseNoteDto
{
    [Required(ErrorMessage = "نص الملاحظة مطلوب.")]
    public string Note { get; set; } = string.Empty;
}
