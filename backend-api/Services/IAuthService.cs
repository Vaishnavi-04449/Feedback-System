using GlobalFeedbackManagement.Models;

namespace GlobalFeedbackManagement.Services
{
    public interface IAuthService
    {
        Task<AuthResult> LoginAsync(string email, string password);
    }

    public class AuthResult
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public User Data { get; set; }
        public string Token { get; set; } 
    }
}
