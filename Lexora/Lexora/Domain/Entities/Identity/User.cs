namespace Lexora.Domain.Entities.Identity;

public class User
{
    public int Id { get; set; }
    public int PersonId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public int? CreatedByUserId { get; set; }

    // Navigation Properties
    public Person? Person { get; set; }
    public List<Role> Roles { get; set; } = new();
}
