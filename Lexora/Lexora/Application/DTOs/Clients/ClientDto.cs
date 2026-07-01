namespace Lexora.Application.DTOs.Clients;

public class ClientDto
{
    public int Id { get; set; }
    public string ClientType { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string? NationalId { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public string? Address { get; set; }
    public string? Notes { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public int? CreatedByUserId { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int? UpdatedByUserId { get; set; }
    
    // Statistics
    public int ActiveCasesCount { get; set; }
    public int TotalCasesCount { get; set; }
}
