using Microsoft.EntityFrameworkCore;
using GlobalFeedbackManagement.Models;

namespace GlobalFeedbackManagement.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Country> Countries { get; set; }
        public DbSet<Consultant> Consultants { get; set; }
        public DbSet<Feedback> Feedbacks { get; set; }
        public DbSet<Notification> Notifications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Seed data or specify constraints
            modelBuilder.Entity<Consultant>()
                .HasOne<Country>()
                .WithMany()
                .HasForeignKey(c => c.CountryId);

            modelBuilder.Entity<Feedback>()
                .HasOne<Consultant>()
                .WithMany()
                .HasForeignKey(f => f.ConsultantId);

            modelBuilder.Entity<Notification>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(n => n.UserId);

            // Integrated DbSeeder
            DbSeeder.Seed(modelBuilder);
        }
    }
}
