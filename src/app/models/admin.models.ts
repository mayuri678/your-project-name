export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer' | 'user';
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  isPremium: boolean;
  price: number;
  isActive: boolean;
  previewUrl?: string;
  thumbnailUrl?: string;
  downloadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in days
  features: string[];
  isActive: boolean;
  createdAt: Date;
}

export interface Analytics {
  totalUsers: number;
  totalTemplates: number;
  totalDownloads: number;
  totalRevenue: number;
  activeSubscriptions: number;
  recentActivity: ActivityLog[];
}

export interface ActivityLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  timestamp: Date;
  details?: string;
}

export interface Feedback {
  id: string;
  userId: string;
  userEmail: string;
  subject: string;
  message: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: Date;
  resolvedAt?: Date;
  adminResponse?: string;
}

export interface DashboardStats {
  users: {
    total: number;
    active: number;
    new: number;
  };
  templates: {
    total: number;
    premium: number;
    downloads: number;
  };
  revenue: {
    total: number;
    monthly: number;
    subscriptions: number;
  };
  feedback: {
    pending: number;
    resolved: number;
    total: number;
  };
}