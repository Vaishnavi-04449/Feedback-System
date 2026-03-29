namespace GlobalFeedbackManagement.Models
{
    public class Consultant
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Role { get; set; }
        public int CountryId { get; set; }
        public int AssignedCUManagerId { get; set; }
        public string Status { get; set; } // e.g., "Active", "Inactive"
    }

    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string Role { get; set; } // e.g., "GTM Manager", "CU Manager"
    }

    public class Country
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class Feedback
    {
        public int Id { get; set; }
        public int ConsultantId { get; set; }
        public int GtmManagerId { get; set; }
        public int Rating { get; set; }
        public string Comments { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class Notification
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Message { get; set; }
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
