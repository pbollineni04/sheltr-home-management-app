-- Add a task_id column to timeline_events to link tasks to timeline events
ALTER TABLE public.timeline_events 
ADD COLUMN task_id UUID REFERENCES public.tasks(id);

-- Create an index for better query performance on task_id
CREATE INDEX idx_timeline_events_task_id ON public.timeline_events(task_id);

-- Create a function to automatically create timeline events when tasks are completed
CREATE OR REPLACE FUNCTION create_timeline_event_for_completed_task()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create timeline event if task is being marked as completed (not uncompleted)
  IF NEW.completed = true AND OLD.completed = false THEN
    INSERT INTO public.timeline_events (
      user_id,
      title,
      description,
      date,
      category,
      room,
      room_id,
      tags,
      task_id,
      metadata
    ) VALUES (
      NEW.user_id,
      'Completed: ' || NEW.title,
      COALESCE(NEW.description, 'Task completed successfully'),
      CURRENT_DATE,
      CASE 
        WHEN NEW.list_type = 'maintenance' THEN 'maintenance'
        WHEN NEW.list_type = 'projects' THEN 'renovation'
        ELSE 'maintenance'
      END::timeline_category,
      NEW.room,
      NEW.room_id,
      ARRAY['task', 'completed', NEW.priority, NEW.list_type],
      NEW.id,
      jsonb_build_object(
        'original_task_id', NEW.id,
        'task_priority', NEW.priority,
        'task_list_type', NEW.list_type,
        'completed_at', NOW()
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically create timeline events for completed tasks
CREATE TRIGGER trigger_create_timeline_event_for_completed_task
  AFTER UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION create_timeline_event_for_completed_task();

-- Enable RLS on timeline_events table if not already enabled
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for timeline_events if they don't exist
DO $$
BEGIN
  -- Check if policies exist and create them if they don't
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'timeline_events' AND policyname = 'Users can view their own timeline events'
  ) THEN
    CREATE POLICY "Users can view their own timeline events" 
      ON public.timeline_events 
      FOR SELECT 
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'timeline_events' AND policyname = 'Users can create their own timeline events'
  ) THEN
    CREATE POLICY "Users can create their own timeline events" 
      ON public.timeline_events 
      FOR INSERT 
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'timeline_events' AND policyname = 'Users can update their own timeline events'
  ) THEN
    CREATE POLICY "Users can update their own timeline events" 
      ON public.timeline_events 
      FOR UPDATE 
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'timeline_events' AND policyname = 'Users can delete their own timeline events'
  ) THEN
    CREATE POLICY "Users can delete their own timeline events" 
      ON public.timeline_events 
      FOR DELETE 
      USING (auth.uid() = user_id);
  END IF;
END
$$;
