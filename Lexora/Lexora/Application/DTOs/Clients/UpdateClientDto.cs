namespace Lexora.Application.DTOs.Clients;

public class UpdateClientDto
{
    public string ClientType { get; set; } = "Individual";
    public string FullName { get; set; } = string.Empty;
    public string? NationalId { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public string? Address { get; set; }
    public string? Notes { get; set; }
    public string Status { get; set; } = "Active"; // Active, Inactive, Archived
}
