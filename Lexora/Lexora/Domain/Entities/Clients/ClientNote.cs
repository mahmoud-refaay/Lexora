namespace Lexora.Domain.Entities.Clients;

public class ClientNote
{
    public int Id { get; set; }
    public int ClientId { get; set; }
    public string Note { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public int? CreatedByUserId { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int? UpdatedByUserId { get; set; }

    // Join property
    public string? AuthorName { get; set; }
}
