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
  htmlContent?: string;
  cssContent?: string;
  color?: string;
  layout?: string;
  templateFeatures?: string[];
  hasPhoto?: boolean;
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
  resumes?: {
    total: number;
    featured: number;
  };
  notifications?: {
    unread: number;
  };
}

export interface Resume {
  id: string;
  user_id: string;
  user_email?: string;
  user_name?: string;
  title: string;
  content?: any;
  template_id?: string;
  is_featured: boolean;
  ats_score: number;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface Download {
  id: string;
  user_id: string;
  user_email?: string;
  resume_id?: string;
  resume_title?: string;
  template_id?: string;
  format: 'pdf' | 'docx' | 'txt';
  downloaded_at: string;
}

export interface AppSetting {
  id: string;
  key: string;
  value: string;
  type: 'string' | 'json' | 'boolean' | 'number';
  description?: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id?: string;
  user_email?: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'announcement';
  channel: 'in_app' | 'email' | 'both';
  is_read: boolean;
  sent_at: string;
  read_at?: string;
}

export interface DownloadStat {
  user_email: string;
  download_count: number;
  last_download: string;
}

export interface TemplateUsageStat {
  template_id: string;
  template_name: string;
  usage_count: number;
}