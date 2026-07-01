namespace Lexora.Domain.Entities.Clients;

public class ConflictResult
{
    public int EntityId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty; // ClientType or 'Opponent'
    public string Role { get; set; } = string.Empty; // 'Client' or 'Opponent'
    public string Status { get; set; } = string.Empty;
    public string? CaseNumber { get; set; }
    public string? CaseTitle { get; set; }
}
