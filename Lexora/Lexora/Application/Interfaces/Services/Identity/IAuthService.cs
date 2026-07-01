using Lexora.Application.DTOs.Auth;

namespace Lexora.Application.Interfaces.Services.Identity;

public interface IAuthService
{
    Task<LoginResponseDto> LoginAsync(LoginRequestDto dto, string? ipAddress = null, string? userAgent = null);
    Task<LoginResponseDto> RefreshTokenAsync(RefreshTokenRequestDto dto, string? ipAddress = null);
    Task ChangePasswordAsync(int userId, ChangePasswordRequestDto dto, string? ipAddress = null, string? userAgent = null);
    Task LogoutAsync(int userId, string? ipAddress = null);
}
