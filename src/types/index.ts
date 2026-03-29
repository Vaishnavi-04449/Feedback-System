export type Role = 'GTM Manager' | 'CU Manager';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface Country {
  id: number;
  name: string;
}

export interface Consultant {
  id: number;
  name: string;
  countryId: number;
  assignedCUManagerId: number;
  status: 'Active' | 'On Leave' | 'Inactive';
  role: string;
}

export interface Feedback {
  id: number;
  consultantId: number;
  gtmManagerId: number;
  rating: number; // 1 to 5
  comments: string;
  createdAt: string;
}

export interface Notification {
  id: number;
  userId: number;
  message: string;
  isRead: boolean;
  createdAt: string;
}
