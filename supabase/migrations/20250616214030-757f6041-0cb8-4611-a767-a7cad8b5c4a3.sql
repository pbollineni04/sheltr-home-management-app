-- Create enum types for better data consistency
CREATE TYPE public.task_priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE public.task_list_type AS ENUM ('maintenance', 'projects', 'shopping');
CREATE TYPE public.expense_category AS ENUM ('renovation', 'maintenance', 'appliances', 'services', 'utilities');
CREATE TYPE public.timeline_category AS ENUM ('renovation', 'maintenance', 'purchase', 'inspection');
CREATE TYPE public.utility_type AS ENUM ('electricity', 'gas', 'water', 'internet');
CREATE TYPE public.sensor_type AS ENUM ('temperature', 'humidity', 'motion', 'door', 'window', 'smoke', 'water_leak');
CREATE TYPE public.alert_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE public.document_type AS ENUM ('warranty', 'insurance', 'certificate', 'manual', 'receipt', 'inspection');
CREATE TYPE public.alert_type AS ENUM ('sensor_alert', 'maintenance_reminder', 'warranty_expiration', 'utility_anomaly', 'security_breach');

-- Auto-bump updated_at function
CREATE OR REPLACE FUNCTION public.bump_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Rooms lookup table
CREATE TABLE public.rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, name)
);

-- Documents table for Warranty Vault
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  document_type public.document_type,
  category TEXT,
  expiration_date DATE,
  upload_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reminder_days INTEGER DEFAULT 30,
  notes TEXT,
  archived BOOLEAN NOT NULL DEFAULT false,
  file_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tasks table for Tasks & Lists
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  list_type task_list_type NOT NULL DEFAULT 'maintenance',
  priority task_priority NOT NULL DEFAULT 'medium',
  due_date DATE,
  completed BOOLEAN NOT NULL DEFAULT false,
  room TEXT,
  room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}',
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Expenses table for Expense Tracker
CREATE TABLE public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category expense_category NOT NULL,
  date DATE NOT NULL,
  vendor TEXT,
  room TEXT,
  room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
  receipt_url TEXT,
  metadata JSONB DEFAULT '{}',
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Timeline events table for Home Timeline
CREATE TABLE public.timeline_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  category timeline_category NOT NULL,
  room TEXT,
  room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
  cost DECIMAL(10,2),
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Utility readings table for Energy Tracker
CREATE TABLE public.utility_readings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  utility_type utility_type NOT NULL,
  usage_amount DECIMAL(10,2) NOT NULL,
  unit TEXT NOT NULL,
  cost DECIMAL(10,2),
  reading_date DATE NOT NULL,
  trend_direction TEXT,
  trend_percent DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Sensors table for Smart Alerts
CREATE TABLE public.sensors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type sensor_type NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  current_value DECIMAL(10,2),
  unit TEXT,
  battery_level INTEGER,
  last_update TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}',
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Alerts table for Smart Alerts
CREATE TABLE public.alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sensor_id UUID REFERENCES public.sensors(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  severity alert_severity NOT NULL DEFAULT 'medium',
  alert_type TEXT NOT NULL,
  alert_type_enum public.alert_type,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  auto_task_created BOOLEAN NOT NULL DEFAULT false,
  resolved BOOLEAN NOT NULL DEFAULT false,
  resolved_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  deleted_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Predictive insights table for Smart Alerts
CREATE TABLE public.predictive_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  confidence_score INTEGER NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
  days_until INTEGER,
  category TEXT NOT NULL,
  recommendation TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.utility_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sensors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictive_insights ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for rooms
CREATE POLICY "Users can view their own rooms" ON public.rooms FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own rooms" ON public.rooms FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own rooms" ON public.rooms FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own rooms" ON public.rooms FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for documents
CREATE POLICY "Users can view their own documents" ON public.documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own documents" ON public.documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own documents" ON public.documents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own documents" ON public.documents FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for tasks (with soft delete)
CREATE POLICY "Users can view their own active tasks" ON public.tasks FOR SELECT USING (auth.uid() = user_id AND deleted_at IS NULL);
CREATE POLICY "Users can insert their own tasks" ON public.tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tasks" ON public.tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own tasks" ON public.tasks FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for expenses (with soft delete)
CREATE POLICY "Users can view their own active expenses" ON public.expenses FOR SELECT USING (auth.uid() = user_id AND deleted_at IS NULL);
CREATE POLICY "Users can insert their own expenses" ON public.expenses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own expenses" ON public.expenses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own expenses" ON public.expenses FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for timeline_events (with soft delete)
CREATE POLICY "Users can view their own active timeline events" ON public.timeline_events FOR SELECT USING (auth.uid() = user_id AND deleted_at IS NULL);
CREATE POLICY "Users can insert their own timeline events" ON public.timeline_events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own timeline events" ON public.timeline_events FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own timeline events" ON public.timeline_events FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for utility_readings
CREATE POLICY "Users can view their own utility readings" ON public.utility_readings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own utility readings" ON public.utility_readings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own utility readings" ON public.utility_readings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own utility readings" ON public.utility_readings FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for sensors (with soft delete)
CREATE POLICY "Users can view their own active sensors" ON public.sensors FOR SELECT USING (auth.uid() = user_id AND deleted_at IS NULL);
CREATE POLICY "Users can insert their own sensors" ON public.sensors FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own sensors" ON public.sensors FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own sensors" ON public.sensors FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for alerts (with soft delete)
CREATE POLICY "Users can view their own active alerts" ON public.alerts FOR SELECT USING (auth.uid() = user_id AND deleted_at IS NULL);
CREATE POLICY "Users can insert their own alerts" ON public.alerts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own alerts" ON public.alerts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own alerts" ON public.alerts FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for predictive_insights
CREATE POLICY "Users can view their own insights" ON public.predictive_insights FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own insights" ON public.predictive_insights FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own insights" ON public.predictive_insights FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own insights" ON public.predictive_insights FOR DELETE USING (auth.uid() = user_id);

-- Apply auto-update triggers to all tables
CREATE TRIGGER trg_documents_updated BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION public.bump_updated_at();
CREATE TRIGGER trg_tasks_updated BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.bump_updated_at();
CREATE TRIGGER trg_expenses_updated BEFORE UPDATE ON public.expenses FOR EACH ROW EXECUTE FUNCTION public.bump_updated_at();
CREATE TRIGGER trg_timeline_events_updated BEFORE UPDATE ON public.timeline_events FOR EACH ROW EXECUTE FUNCTION public.bump_updated_at();
CREATE TRIGGER trg_utility_readings_updated BEFORE UPDATE ON public.utility_readings FOR EACH ROW EXECUTE FUNCTION public.bump_updated_at();
CREATE TRIGGER trg_sensors_updated BEFORE UPDATE ON public.sensors FOR EACH ROW EXECUTE FUNCTION public.bump_updated_at();
CREATE TRIGGER trg_alerts_updated BEFORE UPDATE ON public.alerts FOR EACH ROW EXECUTE FUNCTION public.bump_updated_at();
CREATE TRIGGER trg_predictive_insights_updated BEFORE UPDATE ON public.predictive_insights FOR EACH ROW EXECUTE FUNCTION public.bump_updated_at();

-- Performance indexes
CREATE INDEX idx_rooms_user_id ON public.rooms(user_id);
CREATE INDEX idx_documents_user_id ON public.documents(user_id);
CREATE INDEX idx_documents_expiration_date ON public.documents(expiration_date);
CREATE INDEX idx_documents_userid_expiration ON public.documents (user_id, expiration_date) WHERE archived = false;
CREATE INDEX idx_documents_metadata_gin ON public.documents USING GIN (metadata);

CREATE INDEX idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX idx_tasks_room_id ON public.tasks(room_id);
CREATE INDEX idx_tasks_userid_completed_due ON public.tasks (user_id, completed, due_date);
CREATE INDEX idx_tasks_metadata_gin ON public.tasks USING GIN (metadata);

CREATE INDEX idx_expenses_user_id ON public.expenses(user_id);
CREATE INDEX idx_expenses_date ON public.expenses(date);
CREATE INDEX idx_expenses_room_id ON public.expenses(room_id);
CREATE INDEX idx_expenses_userid_date ON public.expenses (user_id, date DESC);
CREATE INDEX idx_expenses_metadata_gin ON public.expenses USING GIN (metadata);

CREATE INDEX idx_timeline_events_user_id ON public.timeline_events(user_id);
CREATE INDEX idx_timeline_events_date ON public.timeline_events(date);
CREATE INDEX idx_timeline_room_id ON public.timeline_events(room_id);
CREATE INDEX idx_timeline_userid_date ON public.timeline_events (user_id, date DESC);
CREATE INDEX idx_timeline_tags_gin ON public.timeline_events USING GIN (tags);
CREATE INDEX idx_timeline_metadata_gin ON public.timeline_events USING GIN (metadata);

CREATE INDEX idx_utility_readings_user_id ON public.utility_readings(user_id);
CREATE INDEX idx_utility_readings_date ON public.utility_readings(reading_date);
CREATE INDEX idx_utility_userid_type_date ON public.utility_readings (user_id, utility_type, reading_date DESC);

CREATE INDEX idx_sensors_user_id ON public.sensors(user_id);
CREATE INDEX idx_sensors_userid_status ON public.sensors (user_id, status);
CREATE INDEX idx_sensors_metadata_gin ON public.sensors USING GIN (metadata);

CREATE INDEX idx_alerts_user_id ON public.alerts(user_id);
CREATE INDEX idx_alerts_timestamp ON public.alerts(timestamp);
CREATE INDEX idx_alerts_userid_resolved_ts ON public.alerts (user_id, resolved, timestamp DESC);
CREATE INDEX idx_alerts_metadata_gin ON public.alerts USING GIN (metadata);

CREATE INDEX idx_predictive_insights_user_id ON public.predictive_insights(user_id);
