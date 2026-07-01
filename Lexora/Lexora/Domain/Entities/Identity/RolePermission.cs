namespace Lexora.Domain.Entities.Identity;

public class RolePermission
{
    public int RoleId { get; set; }
    public int PermissionId { get; set; }
    public DateTime GrantedAt { get; set; }
    public int? GrantedByUserId { get; set; }
}
