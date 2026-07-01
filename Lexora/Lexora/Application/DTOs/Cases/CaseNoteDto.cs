namespace Lexora.Application.DTOs.Cases;

public class CaseNoteDto
{
    public int Id { get; set; }
    public int CaseId { get; set; }
    public string Note { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public int? CreatedByUserId { get; set; }
    public string? AuthorName { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int? UpdatedByUserId { get; set; }
}
