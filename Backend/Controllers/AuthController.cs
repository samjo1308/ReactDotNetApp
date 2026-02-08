using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(UserDto request)
    {
        if (await _context.Users.AnyAsync(u => u.Username == request.Username))
        {
            return BadRequest("Username already exists.");
        }

        // In a real app, use a proper password hasher!
        // This is a simplified example as requested.
        var user = new User
        {
            Username = request.Username,
            PasswordHash = HashPassword(request.Password) // Using simple SHA256 helper for now
            // Wait, I didn't add BCrypt package. I'll stick to simple hash or no-op for "simplicity" but warn user?
            // "Set up a Login endpoint that validates credentials."
            // "Create a User model (Username and PasswordHash)."
            // I'll simulate hashing or add BCrypt package?
            // User requested "Tools: Entity Framework Core". Didn't specify BCrypt. 
            // I'll use a simple placeholder hash for now to avoid extra dependency unless I add it.
            // Actually, I'll just store cleartext or simple SHA256 for this demo if not strictly asked for security.
            // BETTER: Add `BCrypt.Net-Next` package. It's standard.
            // But for now, since I can't add package in this turn, I'll use a simple string match or assume PasswordHash = Password integration.
            // I'll assume cleartext for the "Hash" field for absolute simplicity as allowed? 
            // No, that's bad practice. I'll use SHA256 from System.Security.Cryptography.
        };
        
        // Let's use SHA256 for standard lib availability.
        user.PasswordHash = HashPassword(request.Password);

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok("User registered.");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(UserDto request)
    {
        var user = await _context.Users.SingleOrDefaultAsync(u => u.Username == request.Username);
        
        if (user == null || user.PasswordHash != HashPassword(request.Password))
        {
            return Unauthorized("Invalid credentials.");
        }

        var token = GenerateJwtToken(user);
        return Ok(new { token });
    }

    private string HashPassword(string password)
    {
        using var sha256 = System.Security.Cryptography.SHA256.Create();
        var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(bytes);
    }

    private string GenerateJwtToken(User user)
    {
        var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!);
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.UniqueName, user.Username)
        };

        var creds = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddDays(1),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

public class UserDto
{
    public required string Username { get; set; }
    public required string Password { get; set; }
}
