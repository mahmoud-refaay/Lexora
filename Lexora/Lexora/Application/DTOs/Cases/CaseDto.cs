namespace Lexora.Application.DTOs.Cases;

public class CaseDto
{
    public int Id { get; set; }
    public int ClientId { get; set; }
    public string? ClientName { get; set; }
    public string? ClientPhone { get; set; }
    public int? ParentCaseId { get; set; }
    public string? ParentCaseNumber { get; set; }
    public int? AssignedLawyerId { get; set; }
    public string? AssignedLawyerName { get; set; }
    public string? CaseNumber { get; set; }
    public int? CaseYear { get; set; }
    public string? CaseType { get; set; }
    public string? CourtName { get; set; }
    public string? CourtCircuit { get; set; }
    public string ClientRole { get; set; } = "Plaintiff";
    public string? OpponentName { get; set; }
    public string? OpponentLawyer { get; set; }
    public string? Subject { get; set; }
    public string Status { get; set; } = "Open";
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    
    public bool IsArchived { get; set; }
    public DateTime CreatedAt { get; set; }
    public int? CreatedByUserId { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int? UpdatedByUserId { get; set; }
    public DateTime? ArchivedAt { get; set; }
    public int? ArchivedByUserId { get; set; }
}
