using System.ComponentModel.DataAnnotations;

namespace GlobalFeedbackManagement.DTOs
{
    public class SubmitFeedbackDto
    {
        [Required]
        public int ConsultantId { get; set; }
        
        [Required]
        [Range(1, 5)]
        public int Rating { get; set; }
        
        [Required]
        public string Comments { get; set; }
    }

    public class LoginDto
    {
        [Required]
        public string Email { get; set; }
        
        [Required]
        public string Password { get; set; }
    }
}
