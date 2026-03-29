using Microsoft.AspNetCore.Mvc;
using GlobalFeedbackManagement.Models;
using GlobalFeedbackManagement.Services;
using Microsoft.AspNetCore.Authorization;

namespace GlobalFeedbackManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ConsultantController : ControllerBase
    {
        private readonly IConsultantService _consultantService;

        public ConsultantController(IConsultantService consultantService)
        {
            _consultantService = consultantService;
        }

        [HttpGet]
        [Authorize(Roles = "GTM Manager")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _consultantService.GetAllConsultantsAsync();
            return Ok(data);
        }

        [HttpGet("assigned")]
        [Authorize(Roles = "CU Manager")]
        public async Task<IActionResult> GetAssigned()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            if (userIdClaim == null) return Unauthorized();

            var data = await _consultantService.GetAssignedConsultantsAsync(int.Parse(userIdClaim));
            return Ok(data);
        }
    }
}
