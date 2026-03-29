using GlobalFeedbackManagement.Models;

namespace GlobalFeedbackManagement.Services
{
    public interface IFeedbackService
    {
        Task<FeedbackResult> SubmitFeedbackAsync(SubmitFeedbackDto dto, int gtmManagerId);
        Task<List<Feedback>> GetFeedbackHistoryAsync(int consultantId, int currentUserId, string role);
    }

    public class FeedbackResult
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public Feedback Data { get; set; }
    }

    public class FeedbackService : IFeedbackService
    {
        private readonly Data.AppDbContext _context;

        public FeedbackService(Data.AppDbContext context)
        {
            _context = context;
        }

        public async Task<FeedbackResult> SubmitFeedbackAsync(SubmitFeedbackDto dto, int gtmManagerId)
        {
            var feedback = new Feedback
            {
                ConsultantId = dto.ConsultantId,
                GtmManagerId = gtmManagerId,
                Rating = dto.Rating,
                Comments = dto.Comments,
                CreatedAt = DateTime.UtcNow
            };

            _context.Feedbacks.Add(feedback);
            
            // Generate notification for CU Manager
            var consultant = await _context.Consultants.FindAsync(dto.ConsultantId);
            if (consultant != null)
            {
                var notification = new Notification
                {
                    UserId = consultant.AssignedCUManagerId,
                    Message = $"New feedback submitted for {consultant.Name}",
                    IsRead = false,
                    CreatedAt = DateTime.UtcNow
                };
                _context.Notifications.Add(notification);
            }

            await _context.SaveChangesAsync();

            return new FeedbackResult { Success = true, Data = feedback };
        }

        public async Task<List<Feedback>> GetFeedbackHistoryAsync(int consultantId, int currentUserId, string role)
        {
            if (role == "CU Manager")
            {
                // Check if consultant is assigned to this CU manager
                var consultant = await _context.Consultants.FindAsync(consultantId);
                if (consultant == null || consultant.AssignedCUManagerId != currentUserId)
                {
                    return null; // Access forbidden
                }
            }

            return await _context.Feedbacks
                .Where(f => f.ConsultantId == consultantId)
                .OrderByDescending(f => f.CreatedAt)
                .ToListAsync();
        }
    }
}
