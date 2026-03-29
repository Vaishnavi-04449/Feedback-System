using GlobalFeedbackManagement.Models;

namespace GlobalFeedbackManagement.Services
{
    public interface IConsultantService
    {
        Task<List<Consultant>> GetAllConsultantsAsync();
        Task<List<Consultant>> GetAssignedConsultantsAsync(int cuManagerId);
    }

    public class ConsultantService : IConsultantService
    {
        private readonly Data.AppDbContext _context;

        public ConsultantService(Data.AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Consultant>> GetAllConsultantsAsync()
        {
            return await _context.Consultants.ToListAsync();
        }

        public async Task<List<Consultant>> GetAssignedConsultantsAsync(int cuManagerId)
        {
            return await _context.Consultants
                .Where(c => c.AssignedCUManagerId == cuManagerId)
                .ToListAsync();
        }
    }
}
