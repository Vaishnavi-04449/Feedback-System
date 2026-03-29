using GlobalFeedbackManagement.Data;
using GlobalFeedbackManagement.Models;
using Microsoft.EntityFrameworkCore;

namespace GlobalFeedbackManagement.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;

        public AuthService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<AuthResult> LoginAsync(string email, string password)
        {
            // Automatic Role Determination from Email Pattern
            string detectedRole = null;
            if (email.ToLower().Contains(".gtm@"))
            {
                detectedRole = "GTM Manager";
            }
            else if (email.ToLower().Contains(".cu@"))
            {
                detectedRole = "CU Manager";
            }

            if (detectedRole == null)
            {
                return new AuthResult { Success = false, Message = "Invalid email pattern. Role cannot be determined." };
            }

            // Find User in Database
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());

            if (user == null)
            {
                return new AuthResult { Success = false, Message = "User not found or invalid credentials." };
            }

            // Role Validation against Email Pattern
            if (user.Role != detectedRole)
            {
                return new AuthResult { Success = false, Message = "Invalid role for this email pattern." };
            }

            // Simplified: In a real app, verify password hash here
            // If (BCrypt.Verify(password, user.PasswordHash)) ...

            return new AuthResult 
            { 
                Success = true, 
                Message = $"Welcome back, {user.Name}",
                Data = user,
                Token = "fake-jwt-token" // Simulate token generation
            };
        }
    }
}
