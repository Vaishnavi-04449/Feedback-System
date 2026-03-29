using Microsoft.AspNetCore.Mvc;
using GlobalFeedbackManagement.DTOs;
using GlobalFeedbackManagement.Services;

namespace GlobalFeedbackManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _authService.LoginAsync(dto.Email, dto.Password);

            if (!result.Success)
                return Unauthorized(new { message = result.Message });

            return Ok(new { 
                user = result.Data, 
                token = result.Token, 
                message = result.Message 
            });
        }
    }
}
