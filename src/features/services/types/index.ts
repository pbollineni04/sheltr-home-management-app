// Service categories
export type ServiceCategory =
  | 'plumbing'
  | 'electrical'
  | 'hvac'
  | 'landscaping'
  | 'cleaning'
  | 'pest_control'
  | 'roofing'
  | 'painting'
  | 'appliance_repair'
  | 'general_handyman'
  | 'other';

export type ServiceStatus =
  | 'scheduled'
  | 'needs_reschedule'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'overdue';

export type ServiceFrequency =
  | 'weekly'
  | 'biweekly'
  | 'monthly'
  | 'quarterly'
  | 'semiannually'
  | 'annually';

export type ServicePriority = 'low' | 'medium' | 'high';

export interface ServiceProvider {
  id: string;
  user_id: string;
  name: string;
  category: ServiceCategory;
  phone?: string;
  email?: string;
  website?: string;
  notes?: string;
  rating?: number;
  is_favorite: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ServiceRecurrence {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category: ServiceCategory;
  provider_id?: string;
  frequency: ServiceFrequency;
  start_date: string;
  end_date?: string;
  next_due_date: string;
  estimated_cost?: number;
  is_active: boolean;
  room?: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  // Joined
  provider?: ServiceProvider;
}

export interface Service {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category: ServiceCategory;
  provider_id?: string;
  recurrence_id?: string;
  status: ServiceStatus;
  scheduled_date: string;
  scheduled_time?: string;
  completed_date?: string;
  estimated_cost?: number;
  actual_cost?: number;
  room?: string;
  priority: ServicePriority;
  task_id?: string;
  attachments: unknown[];
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  // Joined
  provider?: ServiceProvider;
  recurrence?: ServiceRecurrence;
}

// Display helpers
export const SERVICE_CATEGORY_LABELS: Record<ServiceCategory, string> = {
  plumbing: 'Plumbing',
  electrical: 'Electrical',
  hvac: 'HVAC',
  landscaping: 'Landscaping',
  cleaning: 'Cleaning',
  pest_control: 'Pest Control',
  roofing: 'Roofing',
  painting: 'Painting',
  appliance_repair: 'Appliance Repair',
  general_handyman: 'General Handyman',
  other: 'Other',
};

export const SERVICE_STATUS_LABELS: Record<ServiceStatus, string> = {
  scheduled: 'Scheduled',
  needs_reschedule: 'Needs Reschedule',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  overdue: 'Overdue',
};

export const SERVICE_FREQUENCY_LABELS: Record<ServiceFrequency, string> = {
  weekly: 'Weekly',
  biweekly: 'Every 2 Weeks',
  monthly: 'Monthly',
  quarterly: 'Every 3 Months',
  semiannually: 'Every 6 Months',
  annually: 'Annually',
};
