namespace Lexora.Domain.Entities.Clients;

public class Client
{
    public int Id { get; set; }
    public string ClientType { get; set; } = "Individual";
    public string FullName { get; set; } = string.Empty;
    public string? NationalId { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public string? Address { get; set; }
    public string? Notes { get; set; }
    public string Status { get; set; } = "Active";
    public bool IsDeleted { get; set; }
    public DateTime CreatedAt { get; set; }
    public int? CreatedByUserId { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int? UpdatedByUserId { get; set; }
    public DateTime? DeletedAt { get; set; }
    public int? DeletedByUserId { get; set; }

    // Statistical/Aggregate Properties (Populated dynamically on GetById)
    public int ActiveCasesCount { get; set; }
    public int TotalCasesCount { get; set; }
}
