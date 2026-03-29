using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using GlobalFeedbackManagement.DTOs;
using GlobalFeedbackManagement.Services;

namespace GlobalFeedbackManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FeedbackController : ControllerBase
    {
        private readonly IFeedbackService _feedbackService;

        public FeedbackController(IFeedbackService feedbackService)
        {
            _feedbackService = feedbackService;
        }

        [HttpPost]
        [Authorize(Roles = "GTM Manager")]
        public async Task<IActionResult> SubmitFeedback([FromBody] SubmitFeedbackDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            var result = await _feedbackService.SubmitFeedbackAsync(dto, int.Parse(userIdClaim));
            
            if (!result.Success)
                return BadRequest(result.Message);

            return Ok(result.Data);
        }

        [HttpGet("{consultantId}")]
        [Authorize(Roles = "GTM Manager, CU Manager")]
        public async Task<IActionResult> GetFeedbackHistory(int consultantId)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            var roleClaim = User.Claims.FirstOrDefault(c => c.Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/role")?.Value;

            var history = await _feedbackService.GetFeedbackHistoryAsync(
                consultantId, 
                int.Parse(userIdClaim), 
                roleClaim);

            if (history == null)
                return Forbid(); // CU manager accessing unassigned consultant

            return Ok(history);
        }
    }
}
