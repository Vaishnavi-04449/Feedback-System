using Microsoft.EntityFrameworkCore;
using GlobalFeedbackManagement.Models;

namespace GlobalFeedbackManagement.Data
{
    public static class DbSeeder
    {
        public static void Seed(ModelBuilder modelBuilder)
        {
            // Seed Countries
            modelBuilder.Entity<Country>().HasData(
                new Country { Id = 1, Name = "India" },
                new Country { Id = 2, Name = "USA" },
                new Country { Id = 3, Name = "UK" },
                new Country { Id = 4, Name = "Sweden" },
                new Country { Id = 5, Name = "Germany" }
            );

            // Seed Users (Managers)
            modelBuilder.Entity<User>().HasData(
                new User { Id = 1, Name = "John Global (GTM)", Email = "john.gtm@mail.com", Role = "GTM Manager" },
                new User { Id = 2, Name = "Rajesh India (CU)", Email = "rajesh.cu@example.com", Role = "CU Manager" },
                new User { Id = 3, Name = "Sarah US (CU)", Email = "sarah.cu@usa.com", Role = "CU Manager" },
                new User { Id = 4, Name = "Oliver UK (CU)", Email = "oliver.cu@uk.com", Role = "CU Manager" },
                new User { Id = 5, Name = "Bjorn Sweden (CU)", Email = "bjorn.cu@sweden.com", Role = "CU Manager" },
                new User { Id = 6, Name = "Hans Germany (CU)", Email = "hans.cu@germany.com", Role = "CU Manager" }
            );

            // Seed Consultants (8 per country)
            var consultants = new List<Consultant>();
            int nextId = 101;

            // India (ID 1)
            AddConsultants(consultants, ref nextId, 1, 2, new[] {
                "Ravi Kumar", "Priya Sharma", "Amit Singh", "Sanjay Gupta",
                "Anjali Desai", "Vikram Reddy", "Meera Iyer", "Arjun Verma"
            });

            // USA (ID 2)
            AddConsultants(consultants, ref nextId, 2, 3, new[] {
                "John Doe", "Jane Smith", "Michael Brown", "Emily Davis",
                "Robert Wilson", "Linda Taylor", "James Anderson", "Patricia White"
            });

            // UK (ID 3)
            AddConsultants(consultants, ref nextId, 3, 4, new[] {
                "George Harrison", "Alice Cooper", "Paul McCartney", "Emma Thompson",
                "Thomas Mueller", "Lily Evans", "William Blake", "Sophie Turner"
            });

            // Sweden (ID 4)
            AddConsultants(consultants, ref nextId, 4, 5, new[] {
                "Lars Ericsson", "Sven Svensson", "Ingrid Bergman", "Agnetha Faltskog",
                "Gustav Adolf", "Freja Nilsson", "Oskar Lindholm", "Maja Forsberg"
            });

            // Germany (ID 5)
            AddConsultants(consultants, ref nextId, 5, 6, new[] {
                "Klaus Weber", "Greta Thunberg", "Friedrich Nietzsche", "Marlene Dietrich",
                "Johann Bach", "Heidi Klum", "Werner Herzog", "Angela Merkel"
            });

            modelBuilder.Entity<Consultant>().HasData(consultants);
        }

        private static void AddConsultants(List<Consultant> list, ref int nextId, int countryId, int cuManagerId, string[] names)
        {
            var roles = new[] { "Senior Developer", "UX Designer", "Architect", "DevOps Engineer", "QA Lead", "Backend Dev", "Fullstack Dev", "Frontend Dev" };
            for (int i = 0; i < names.Length; i++)
            {
                list.Add(new Consultant
                {
                    Id = nextId++,
                    Name = names[i],
                    CountryId = countryId,
                    AssignedCUManagerId = cuManagerId,
                    Status = "Active",
                    Role = roles[i % roles.Length]
                });
            }
        }
    }
}
