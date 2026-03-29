import type { User, Country, Consultant, Feedback, Notification } from '../types';

export const mockUsers: User[] = [
  { id: 1, name: 'John Global (GTM)', email: 'john.gtm@mail.com', role: 'GTM Manager' },
  { id: 2, name: 'Rajesh India (CU)', email: 'rajesh.cu@example.com', role: 'CU Manager' },
  { id: 3, name: 'Sarah US (CU)', email: 'sarah.cu@usa.com', role: 'CU Manager' },
  { id: 4, name: 'Oliver UK (CU)', email: 'oliver.cu@uk.com', role: 'CU Manager' },
  { id: 5, name: 'Bjorn Sweden (CU)', email: 'bjorn.cu@sweden.com', role: 'CU Manager' },
  { id: 6, name: 'Hans Germany (CU)', email: 'hans.cu@germany.com', role: 'CU Manager' },
];

export const mockCountries: Country[] = [
  { id: 1, name: 'India' },
  { id: 2, name: 'USA' },
  { id: 3, name: 'UK' },
  { id: 4, name: 'Sweden' },
  { id: 5, name: 'Germany' }
];

export const mockConsultants: Consultant[] = [
  // India (ID: 1) - Rajesh (ID: 2)
  { id: 101, name: 'Ravi Kumar', countryId: 1, assignedCUManagerId: 2, status: 'Active', role: 'Senior Developer' },
  { id: 102, name: 'Priya Sharma', countryId: 1, assignedCUManagerId: 2, status: 'Active', role: 'UX Designer' },
  { id: 103, name: 'Amit Singh', countryId: 1, assignedCUManagerId: 2, status: 'Active', role: 'Architect' },
  { id: 104, name: 'Sanjay Gupta', countryId: 1, assignedCUManagerId: 2, status: 'Active', role: 'DevOps Engineer' },
  { id: 105, name: 'Anjali Desai', countryId: 1, assignedCUManagerId: 2, status: 'Active', role: 'QA Lead' },
  { id: 106, name: 'Vikram Reddy', countryId: 1, assignedCUManagerId: 2, status: 'Active', role: 'Backend Dev' },
  { id: 107, name: 'Meera Iyer', countryId: 1, assignedCUManagerId: 2, status: 'Active', role: 'Fullstack Dev' },
  { id: 108, name: 'Arjun Verma', countryId: 1, assignedCUManagerId: 2, status: 'Active', role: 'Frontend Dev' },

  // USA (ID: 2) - Sarah (ID: 3)
  { id: 201, name: 'John Doe', countryId: 2, assignedCUManagerId: 3, status: 'Active', role: 'Frontend Engineer' },
  { id: 202, name: 'Jane Smith', countryId: 2, assignedCUManagerId: 3, status: 'Active', role: 'Product Manager' },
  { id: 203, name: 'Michael Brown', countryId: 2, assignedCUManagerId: 3, status: 'Active', role: 'Sales Lead' },
  { id: 204, name: 'Emily Davis', countryId: 2, assignedCUManagerId: 3, status: 'Active', role: 'Solutions Architect' },
  { id: 205, name: 'Robert Wilson', countryId: 2, assignedCUManagerId: 3, status: 'Active', role: 'Cloud Engineer' },
  { id: 206, name: 'Linda Taylor', countryId: 2, assignedCUManagerId: 3, status: 'Active', role: 'Data Scientist' },
  { id: 207, name: 'James Anderson', countryId: 2, assignedCUManagerId: 3, status: 'Active', role: 'Security Specialist' },
  { id: 208, name: 'Patricia White', countryId: 2, assignedCUManagerId: 3, status: 'Active', role: 'HR Business Partner' },

  // UK (ID: 3) - Oliver (ID: 4)
  { id: 301, name: 'George Harrison', countryId: 3, assignedCUManagerId: 4, status: 'Active', role: 'Tech Lead' },
  { id: 302, name: 'Alice Cooper', countryId: 3, assignedCUManagerId: 4, status: 'Active', role: 'Lead Design' },
  { id: 303, name: 'Paul McCartney', countryId: 3, assignedCUManagerId: 4, status: 'Active', role: 'Scrum Master' },
  { id: 304, name: 'Emma Thompson', countryId: 3, assignedCUManagerId: 4, status: 'Active', role: 'Project Director' },
  { id: 305, name: 'Thomas Mueller', countryId: 3, assignedCUManagerId: 4, status: 'Active', role: 'Business Analyst' },
  { id: 306, name: 'Lily Evans', countryId: 3, assignedCUManagerId: 4, status: 'Active', role: 'Systems Admin' },
  { id: 307, name: 'William Blake', countryId: 3, assignedCUManagerId: 4, status: 'Active', role: 'Network Engineer' },
  { id: 308, name: 'Sophie Turner', countryId: 3, assignedCUManagerId: 4, status: 'Active', role: 'Database Admin' },

  // Sweden (ID: 4) - Bjorn (ID: 5)
  { id: 401, name: 'Lars Ericsson', countryId: 4, assignedCUManagerId: 5, status: 'Active', role: 'Lead Developer' },
  { id: 402, name: 'Sven Svensson', countryId: 4, assignedCUManagerId: 5, status: 'Active', role: 'UI Architect' },
  { id: 403, name: 'Ingrid Bergman', countryId: 4, assignedCUManagerId: 5, status: 'Active', role: 'Strategy Officer' },
  { id: 404, name: 'Agnetha Faltskog', countryId: 4, assignedCUManagerId: 5, status: 'Active', role: 'Brand Manager' },
  { id: 405, name: 'Gustav Adolf', countryId: 4, assignedCUManagerId: 5, status: 'Active', role: 'Delivery Lead' },
  { id: 406, name: 'Freja Nilsson', countryId: 4, assignedCUManagerId: 5, status: 'Active', role: 'Innovation Lead' },
  { id: 407, name: 'Oskar Lindholm', countryId: 4, assignedCUManagerId: 5, status: 'Active', role: 'Research Head' },
  { id: 408, name: 'Maja Forsberg', countryId: 4, assignedCUManagerId: 5, status: 'Active', role: 'Customer Success' },

  // Germany (ID: 5) - Hans (ID: 6)
  { id: 501, name: 'Klaus Weber', countryId: 5, assignedCUManagerId: 6, status: 'Active', role: 'Operations Head' },
  { id: 502, name: 'Greta Thunberg', countryId: 5, assignedCUManagerId: 6, status: 'Active', role: 'Sustainability Lead' },
  { id: 503, name: 'Friedrich Nietzsche', countryId: 5, assignedCUManagerId: 6, status: 'Active', role: 'Philosophy Lead' },
  { id: 504, name: 'Marlene Dietrich', countryId: 5, assignedCUManagerId: 6, status: 'Active', role: 'Creative Director' },
  { id: 505, name: 'Johann Bach', countryId: 5, assignedCUManagerId: 6, status: 'Active', role: 'Orchestration Expert' },
  { id: 506, name: 'Heidi Klum', countryId: 5, assignedCUManagerId: 6, status: 'Active', role: 'Fashion Consultant' },
  { id: 507, name: 'Werner Herzog', countryId: 5, assignedCUManagerId: 6, status: 'Active', role: 'Film Director' },
  { id: 508, name: 'Angela Merkel', countryId: 5, assignedCUManagerId: 6, status: 'Active', role: 'Global Strategy' },
];

export const mockFeedback: Feedback[] = [
  { id: 1, consultantId: 101, gtmManagerId: 1, rating: 5, comments: 'Excellent delivery on the latest GTM project.', createdAt: '2023-10-01T10:00:00Z' },
  { id: 2, consultantId: 101, gtmManagerId: 1, rating: 4, comments: 'Good communication but missed deadline.', createdAt: '2023-09-15T09:30:00Z' },
  { id: 3, consultantId: 201, gtmManagerId: 1, rating: 3, comments: 'Needs improvement in CSS.', createdAt: '2023-10-10T12:00:00Z' }
];

export let mockNotifications: Notification[] = [
  { id: 1, userId: 2, message: 'New feedback submitted for Ravi Kumar.', isRead: false, createdAt: '2023-10-01T10:05:00Z' }
];
