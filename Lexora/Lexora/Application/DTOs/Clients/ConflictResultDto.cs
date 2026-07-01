namespace Lexora.Application.DTOs.Clients;

public class ConflictResultDto
{
    public int EntityId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? CaseNumber { get; set; }
    public string? CaseTitle { get; set; }
}
