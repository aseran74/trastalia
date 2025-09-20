export interface DatabaseStats {
  users: {
    total: number;
    active: number;
    admins: number;
    inactive: number;
  };
  metrics: {
    total: number;
    categories: number;
    periods: number;
  };
}

export interface UserFormData {
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user' | 'moderator';
  isActive: boolean;
}

export interface MetricFormData {
  name: string;
  value: number;
  previousValue?: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  category: 'sales' | 'users' | 'revenue' | 'orders' | 'other';
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  date: string;
  metadata?: Record<string, any>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
