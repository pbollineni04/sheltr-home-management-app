
-- Fix the database trigger to properly cast all tag values as text
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
      ARRAY['task'::text, 'completed'::text, NEW.priority::text, NEW.list_type::text],
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
