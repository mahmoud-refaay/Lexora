namespace Lexora.Application.DTOs.User;

public class UserDto
{
    public int Id { get; set; }
    public int PersonId { get; set; }
    public string Username { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? Address { get; set; }
    public string? Email { get; set; }
    public string? RoleNames { get; set; }
}
