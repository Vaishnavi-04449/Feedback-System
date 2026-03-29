import { mockCountries, mockConsultants, mockFeedback, mockNotifications } from './mockData';
import type { Consultant, Feedback, Country, Notification } from '../types';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // GTM Manager endpoints
  getCountries: async (): Promise<Country[]> => {
    await delay(500);
    return [...mockCountries];
  },

  getAllConsultants: async (): Promise<Consultant[]> => {
    await delay(500);
    return [...mockConsultants];
  },

  // CU Manager endpoints
  getAssignedConsultants: async (cuManagerId: number): Promise<Consultant[]> => {
    await delay(500);
    return mockConsultants.filter(c => c.assignedCUManagerId === cuManagerId);
  },

  // Shared endpoints
  getFeedbackHistory: async (consultantId: number): Promise<Feedback[]> => {
    await delay(400);
    return mockFeedback.filter(f => f.consultantId === consultantId).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  submitFeedback: async (feedback: Omit<Feedback, 'id' | 'createdAt'>): Promise<Feedback> => {
    await delay(800);
    const newFeedback: Feedback = {
      ...feedback,
      id: Math.max(...mockFeedback.map(f => f.id), 0) + 1,
      createdAt: new Date().toISOString()
    };
    mockFeedback.push(newFeedback);

    // Create notification for CU Manager
    const consultant = mockConsultants.find(c => c.id === feedback.consultantId);
    if (consultant) {
      mockNotifications.push({
        id: Math.max(...mockNotifications.map(n => n.id), 0) + 1,
        userId: consultant.assignedCUManagerId,
        message: `New feedback submitted for ${consultant.name}`,
        isRead: false,
        createdAt: new Date().toISOString()
      });
    }

    return newFeedback;
  },

  getNotifications: async (userId: number): Promise<Notification[]> => {
    await delay(300);
    return mockNotifications.filter(n => n.userId === userId).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  markNotificationsRead: async (userId: number): Promise<void> => {
    await delay(200);
    mockNotifications.forEach(n => {
      if (n.userId === userId) n.isRead = true;
    });
  }
};
