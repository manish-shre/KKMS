export interface Member {
  id: string;
  name: string;
  designation: string;
  photoUrl: string;
  bio?: string;
  contact?: string;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  location: string;
  imageUrl: string;
  isFeatured: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}

export interface Profile {
  id: string;
  fullName: string;
  avatarUrl?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface Statistics {
  totalMembers: number;
  totalEvents: number;
  upcomingEvents: number;
  newMembers: number;
}