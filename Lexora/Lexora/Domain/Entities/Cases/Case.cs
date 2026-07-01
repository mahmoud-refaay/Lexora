namespace Lexora.Domain.Entities.Cases;

public class Case
{
    public int Id { get; set; }
    public int ClientId { get; set; }
    public int? ParentCaseId { get; set; }
    public int? AssignedLawyerId { get; set; }
    public string? CaseNumber { get; set; }
    public int? CaseYear { get; set; }
    public string? CaseType { get; set; }
    public string? CourtName { get; set; }
    public string? CourtCircuit { get; set; }
    public string ClientRole { get; set; } = "Plaintiff"; // 'Plaintiff' or 'Defendant'
    public string? OpponentName { get; set; }
    public string? OpponentLawyer { get; set; }
    public string? Subject { get; set; }
    public string Status { get; set; } = "Open"; // 'Open', 'Pending', 'Scheduled', 'Closed'
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    
    // Archiving & Soft-Delete Properties
    public bool IsArchived { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime CreatedAt { get; set; }
    public int? CreatedByUserId { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int? UpdatedByUserId { get; set; }
    public DateTime? ArchivedAt { get; set; }
    public int? ArchivedByUserId { get; set; }
    public DateTime? DeletedAt { get; set; }
    public int? DeletedByUserId { get; set; }

    // Join/Aggregate Display Properties (Populated dynamically from Stored Procedures)
    public string? ClientName { get; set; }
    public string? ClientPhone { get; set; }
    public string? ParentCaseNumber { get; set; }
    public string? AssignedLawyerName { get; set; }
}
