namespace Lexora.Domain.Entities.Cases;

public class CaseNote
{
    public int Id { get; set; }
    public int CaseId { get; set; }
    public string Note { get; set; } = string.Empty;
    public bool IsDeleted { get; set; }
    public DateTime CreatedAt { get; set; }
    public int? CreatedByUserId { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int? UpdatedByUserId { get; set; }
    public DateTime? DeletedAt { get; set; }
    public int? DeletedByUserId { get; set; }

    // Join Display Properties (Populated from Stored Procedures)
    public string? AuthorName { get; set; }
}
