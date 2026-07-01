namespace Lexora.Application.DTOs.Clients;

public class ClientNoteDto
{
    public int Id { get; set; }
    public int ClientId { get; set; }
    public string Note { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public int? CreatedByUserId { get; set; }
    public string? AuthorName { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int? UpdatedByUserId { get; set; }
}
