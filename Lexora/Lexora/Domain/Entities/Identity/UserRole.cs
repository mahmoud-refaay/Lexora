namespace Lexora.Domain.Entities.Identity;

public class UserRole
{
    public int UserId { get; set; }
    public int RoleId { get; set; }
    public DateTime AssignedAt { get; set; }
    public int? AssignedByUserId { get; set; }
}
