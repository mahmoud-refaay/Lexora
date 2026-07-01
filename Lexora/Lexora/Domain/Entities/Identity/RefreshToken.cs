namespace Lexora.Domain.Entities.Identity;

public class RefreshToken
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string FamilyId { get; set; } = string.Empty;
    public string TokenHash { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? CreatedByIp { get; set; }
    public DateTime? RevokedAt { get; set; }
    public string? RevokedByIp { get; set; }
    public int? ReplacedByTokenId { get; set; }
    public string? RevokeReason { get; set; }
}
