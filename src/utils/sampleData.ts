
import { supabase } from '@/integrations/supabase/client';

export const addSampleTasks = async (userId: string) => {
  const sampleTasks = [
    {
      user_id: userId,
      title: "Replace HVAC filters",
      description: "Monthly maintenance task - replace all air filters",
      list_type: "maintenance",
      priority: "medium",
      due_date: "2024-06-15",
      completed: false,
      room: "Basement"
    },
    {
      user_id: userId,
      title: "Clean gutters",
      description: "Remove leaves and debris from gutters",
      list_type: "maintenance",
      priority: "high",
      due_date: "2024-06-10",
      completed: true,
      room: "Exterior"
    },
    {
      user_id: userId,
      title: "Paint guest bedroom",
      description: "Prep walls and apply two coats of paint",
      list_type: "projects",
      priority: "low",
      due_date: "2024-07-01",
      completed: false,
      room: "Guest Bedroom"
    },
    {
      user_id: userId,
      title: "Buy LED bulbs",
      description: "Replace all incandescent bulbs with LED",
      list_type: "shopping",
      priority: "medium",
      due_date: "2024-06-20",
      completed: false,
      room: "Whole House"
    },
    {
      user_id: userId,
      title: "Install smart thermostat",
      description: "Upgrade to programmable smart thermostat",
      list_type: "projects",
      priority: "medium",
      due_date: "2024-06-25",
      completed: false,
      room: "Living Room"
    }
  ];

  const { data, error } = await supabase
    .from('tasks')
    .insert(sampleTasks)
    .select();

  if (error) {
    console.error('Error adding sample tasks:', error);
    throw error;
  }

  return data;
};

export const addSampleRooms = async (userId: string) => {
  const sampleRooms = [
    { user_id: userId, name: "Kitchen" },
    { user_id: userId, name: "Living Room" },
    { user_id: userId, name: "Master Bedroom" },
    { user_id: userId, name: "Guest Bedroom" },
    { user_id: userId, name: "Bathroom" },
    { user_id: userId, name: "Basement" },
    { user_id: userId, name: "Garage" },
    { user_id: userId, name: "Exterior" },
    { user_id: userId, name: "Whole House" }
  ];

  const { data, error } = await supabase
    .from('rooms')
    .insert(sampleRooms)
    .select();

  if (error) {
    console.error('Error adding sample rooms:', error);
    throw error;
  }

  return data;
};
