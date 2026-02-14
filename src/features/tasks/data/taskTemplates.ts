
export interface TaskTemplate {
  id: string;
  title: string;
  description?: string;
  category: string;
  subcategory: string;
  list_type: 'maintenance' | 'projects' | 'shopping';
  priority: 'low' | 'medium' | 'high';
  suggested_room?: string;
  due_date_offset_days?: number; // Days from now
  frequency?: 'weekly' | 'monthly' | 'quarterly' | 'seasonal' | 'yearly';
  season?: 'spring' | 'summer' | 'fall' | 'winter';
  tags: string[];
}

export const taskTemplates: TaskTemplate[] = [
  // MAINTENANCE TASKS
  // Monthly Maintenance
  {
    id: 'hvac-filter',
    title: 'Change HVAC filter',
    description: 'Replace air filter to maintain air quality and system efficiency',
    category: 'Maintenance',
    subcategory: 'Monthly',
    list_type: 'maintenance',
    priority: 'medium',
    suggested_room: 'Utility Room',
    due_date_offset_days: 30,
    frequency: 'monthly',
    tags: ['hvac', 'filter', 'air quality', 'monthly']
  },
  {
    id: 'smoke-detectors',
    title: 'Test smoke detectors',
    description: 'Check all smoke detector batteries and functionality',
    category: 'Maintenance',
    subcategory: 'Monthly',
    list_type: 'maintenance',
    priority: 'high',
    due_date_offset_days: 30,
    frequency: 'monthly',
    tags: ['safety', 'smoke detector', 'battery', 'monthly']
  },
  {
    id: 'garage-door',
    title: 'Test garage door safety features',
    description: 'Check auto-reverse and photo-eye sensors',
    category: 'Maintenance',
    subcategory: 'Monthly',
    list_type: 'maintenance',
    priority: 'medium',
    suggested_room: 'Garage',
    due_date_offset_days: 30,
    frequency: 'monthly',
    tags: ['garage', 'safety', 'sensors', 'monthly']
  },

  // Seasonal Maintenance
  {
    id: 'clean-gutters',
    title: 'Clean gutters and downspouts',
    description: 'Remove debris and check for proper drainage',
    category: 'Maintenance',
    subcategory: 'Seasonal',
    list_type: 'maintenance',
    priority: 'medium',
    due_date_offset_days: 7,
    frequency: 'seasonal',
    season: 'fall',
    tags: ['gutters', 'exterior', 'drainage', 'seasonal']
  },
  {
    id: 'hvac-service',
    title: 'Schedule HVAC professional service',
    description: 'Annual maintenance and tune-up',
    category: 'Maintenance',
    subcategory: 'Seasonal',
    list_type: 'maintenance',
    priority: 'medium',
    due_date_offset_days: 14,
    frequency: 'yearly',
    tags: ['hvac', 'professional', 'service', 'yearly']
  },
  {
    id: 'winterize-outdoor-faucets',
    title: 'Winterize outdoor faucets',
    description: 'Shut off water and drain outdoor spigots',
    category: 'Maintenance',
    subcategory: 'Seasonal',
    list_type: 'maintenance',
    priority: 'high',
    due_date_offset_days: 7,
    frequency: 'seasonal',
    season: 'fall',
    tags: ['plumbing', 'winterize', 'outdoor', 'seasonal']
  },
  {
    id: 'check-caulking',
    title: 'Inspect and replace caulking',
    description: 'Check bathroom and kitchen caulking for wear',
    category: 'Maintenance',
    subcategory: 'Seasonal',
    list_type: 'maintenance',
    priority: 'low',
    suggested_room: 'Bathroom',
    due_date_offset_days: 30,
    frequency: 'yearly',
    tags: ['caulking', 'bathroom', 'kitchen', 'sealant']
  },

  // Periodic Maintenance
  {
    id: 'water-heater-flush',
    title: 'Flush water heater',
    description: 'Drain sediment from water heater tank',
    category: 'Maintenance',
    subcategory: 'Periodic',
    list_type: 'maintenance',
    priority: 'medium',
    suggested_room: 'Utility Room',
    due_date_offset_days: 90,
    frequency: 'yearly',
    tags: ['water heater', 'plumbing', 'maintenance', 'yearly']
  },
  {
    id: 'dryer-vent-clean',
    title: 'Clean dryer vent',
    description: 'Remove lint buildup from dryer vent system',
    category: 'Maintenance',
    subcategory: 'Periodic',
    list_type: 'maintenance',
    priority: 'high',
    suggested_room: 'Laundry Room',
    due_date_offset_days: 90,
    frequency: 'yearly',
    tags: ['dryer', 'vent', 'safety', 'fire prevention']
  },
  {
    id: 'deck-stain',
    title: 'Clean and stain deck',
    description: 'Power wash and apply protective stain',
    category: 'Maintenance',
    subcategory: 'Periodic',
    list_type: 'maintenance',
    priority: 'medium',
    due_date_offset_days: 14,
    frequency: 'yearly',
    season: 'spring',
    tags: ['deck', 'stain', 'exterior', 'protection']
  },

  // PROJECTS
  // Interior Projects
  {
    id: 'paint-bedroom',
    title: 'Paint bedroom',
    description: 'Prep walls and apply fresh paint',
    category: 'Projects',
    subcategory: 'Interior',
    list_type: 'projects',
    priority: 'medium',
    suggested_room: 'Bedroom',
    due_date_offset_days: 30,
    tags: ['painting', 'interior', 'decoration', 'bedroom']
  },
  {
    id: 'install-ceiling-fan',
    title: 'Install ceiling fan',
    description: 'Replace light fixture with ceiling fan',
    category: 'Projects',
    subcategory: 'Interior',
    list_type: 'projects',
    priority: 'medium',
    suggested_room: 'Bedroom',
    due_date_offset_days: 21,
    tags: ['electrical', 'ceiling fan', 'installation', 'cooling']
  },
  {
    id: 'update-kitchen-backsplash',
    title: 'Install kitchen backsplash',
    description: 'Add tile backsplash behind stove and sink',
    category: 'Projects',
    subcategory: 'Interior',
    list_type: 'projects',
    priority: 'low',
    suggested_room: 'Kitchen',
    due_date_offset_days: 45,
    tags: ['kitchen', 'tile', 'backsplash', 'renovation']
  },
  {
    id: 'install-shelving',
    title: 'Install floating shelves',
    description: 'Add storage shelves to living room',
    category: 'Projects',
    subcategory: 'Interior',
    list_type: 'projects',
    priority: 'low',
    suggested_room: 'Living Room',
    due_date_offset_days: 14,
    tags: ['shelving', 'storage', 'organization', 'mounting']
  },

  // Exterior Projects
  {
    id: 'build-garden-bed',
    title: 'Build raised garden bed',
    description: 'Construct wooden raised bed for vegetables',
    category: 'Projects',
    subcategory: 'Exterior',
    list_type: 'projects',
    priority: 'low',
    due_date_offset_days: 21,
    season: 'spring',
    tags: ['garden', 'outdoor', 'woodworking', 'vegetables']
  },
  {
    id: 'install-outdoor-lighting',
    title: 'Install outdoor pathway lighting',
    description: 'Add solar or wired lights along walkway',
    category: 'Projects',
    subcategory: 'Exterior',
    list_type: 'projects',
    priority: 'medium',
    due_date_offset_days: 14,
    tags: ['lighting', 'outdoor', 'safety', 'electrical']
  },
  {
    id: 'build-deck-railing',
    title: 'Install deck railing',
    description: 'Add safety railing to existing deck',
    category: 'Projects',
    subcategory: 'Exterior',
    list_type: 'projects',
    priority: 'high',
    due_date_offset_days: 21,
    tags: ['deck', 'safety', 'railing', 'construction']
  },

  // Organization Projects
  {
    id: 'organize-garage',
    title: 'Organize garage storage',
    description: 'Install pegboard and storage systems',
    category: 'Projects',
    subcategory: 'Organization',
    list_type: 'projects',
    priority: 'medium',
    suggested_room: 'Garage',
    due_date_offset_days: 14,
    tags: ['organization', 'storage', 'garage', 'pegboard']
  },
  {
    id: 'closet-organization',
    title: 'Install closet organization system',
    description: 'Add shelves, rods, and drawer organizers',
    category: 'Projects',
    subcategory: 'Organization',
    list_type: 'projects',
    priority: 'low',
    suggested_room: 'Bedroom',
    due_date_offset_days: 21,
    tags: ['closet', 'organization', 'storage', 'bedroom']
  },

  // SHOPPING LISTS
  // Tools & Hardware
  {
    id: 'buy-drill-bits',
    title: 'Buy drill bit set',
    description: 'Complete set of drill bits for various materials',
    category: 'Shopping',
    subcategory: 'Tools',
    list_type: 'shopping',
    priority: 'medium',
    due_date_offset_days: 7,
    tags: ['tools', 'drill bits', 'hardware', 'DIY']
  },
  {
    id: 'buy-screwdriver-set',
    title: 'Buy screwdriver set',
    description: 'Phillips and flathead screwdrivers, various sizes',
    category: 'Shopping',
    subcategory: 'Tools',
    list_type: 'shopping',
    priority: 'medium',
    due_date_offset_days: 7,
    tags: ['tools', 'screwdrivers', 'hardware', 'basic tools']
  },
  {
    id: 'buy-level',
    title: 'Buy spirit level',
    description: '24-inch level for hanging pictures and shelves',
    category: 'Shopping',
    subcategory: 'Tools',
    list_type: 'shopping',
    priority: 'low',
    due_date_offset_days: 14,
    tags: ['tools', 'level', 'measuring', 'hanging']
  },

  // Supplies
  {
    id: 'buy-cleaning-supplies',
    title: 'Stock up on cleaning supplies',
    description: 'All-purpose cleaner, paper towels, sponges',
    category: 'Shopping',
    subcategory: 'Supplies',
    list_type: 'shopping',
    priority: 'medium',
    due_date_offset_days: 3,
    tags: ['cleaning', 'supplies', 'household', 'maintenance']
  },
  {
    id: 'buy-light-bulbs',
    title: 'Buy replacement light bulbs',
    description: 'LED bulbs for various fixtures around the house',
    category: 'Shopping',
    subcategory: 'Supplies',
    list_type: 'shopping',
    priority: 'low',
    due_date_offset_days: 7,
    tags: ['lighting', 'LED', 'bulbs', 'replacement']
  },
  {
    id: 'buy-batteries',
    title: 'Buy batteries',
    description: 'AA, AAA, and 9V batteries for devices',
    category: 'Shopping',
    subcategory: 'Supplies',
    list_type: 'shopping',
    priority: 'medium',
    due_date_offset_days: 7,
    tags: ['batteries', 'supplies', 'smoke detector', 'devices']
  },

  // Seasonal Shopping
  {
    id: 'buy-winter-supplies',
    title: 'Buy winter supplies',
    description: 'Ice melt, snow shovel, weather stripping',
    category: 'Shopping',
    subcategory: 'Seasonal',
    list_type: 'shopping',
    priority: 'high',
    due_date_offset_days: 14,
    season: 'fall',
    tags: ['winter', 'seasonal', 'ice melt', 'snow', 'weatherproofing']
  },
  {
    id: 'buy-garden-supplies',
    title: 'Buy spring garden supplies',
    description: 'Seeds, fertilizer, mulch, gardening tools',
    category: 'Shopping',
    subcategory: 'Seasonal',
    list_type: 'shopping',
    priority: 'medium',
    due_date_offset_days: 14,
    season: 'spring',
    tags: ['garden', 'spring', 'seeds', 'fertilizer', 'outdoor']
  },

  // Safety & Security
  {
    id: 'buy-smoke-detector-batteries',
    title: 'Buy smoke detector batteries',
    description: '9V batteries for all smoke detectors',
    category: 'Shopping',
    subcategory: 'Safety',
    list_type: 'shopping',
    priority: 'high',
    due_date_offset_days: 3,
    tags: ['safety', 'smoke detector', 'batteries', 'fire safety']
  },
  {
    id: 'buy-fire-extinguisher',
    title: 'Buy fire extinguisher',
    description: 'Multi-purpose fire extinguisher for kitchen',
    category: 'Shopping',
    subcategory: 'Safety',
    list_type: 'shopping',
    priority: 'high',
    suggested_room: 'Kitchen',
    due_date_offset_days: 7,
    tags: ['safety', 'fire extinguisher', 'emergency', 'kitchen']
  },
  {
    id: 'buy-carbon-monoxide-detector',
    title: 'Buy carbon monoxide detector',
    description: 'Battery-powered CO detector for each floor',
    category: 'Shopping',
    subcategory: 'Safety',
    list_type: 'shopping',
    priority: 'high',
    due_date_offset_days: 7,
    tags: ['safety', 'carbon monoxide', 'detector', 'emergency']
  }
];

// Pre-defined task bundles for quick setup
export interface TaskBundle {
  id: string;
  name: string;
  description: string;
  icon: string;
  tasks: string[]; // Array of task template IDs
  seasonal?: boolean;
  season?: 'spring' | 'summer' | 'fall' | 'winter';
}

export const taskBundles: TaskBundle[] = [
  {
    id: 'monthly-maintenance',
    name: 'Monthly Maintenance',
    description: 'Essential monthly home maintenance tasks',
    icon: '🔧',
    tasks: ['hvac-filter', 'smoke-detectors', 'garage-door']
  },
  {
    id: 'spring-cleaning',
    name: 'Spring Cleaning',
    description: 'Comprehensive spring home preparation',
    icon: '🌸',
    seasonal: true,
    season: 'spring',
    tasks: ['clean-gutters', 'deck-stain', 'check-caulking', 'buy-garden-supplies']
  },
  {
    id: 'winter-prep',
    name: 'Winter Preparation',
    description: 'Get your home ready for winter',
    icon: '❄️',
    seasonal: true,
    season: 'fall',
    tasks: ['winterize-outdoor-faucets', 'clean-gutters', 'buy-winter-supplies']
  },
  {
    id: 'safety-check',
    name: 'Home Safety Check',
    description: 'Important safety and security tasks',
    icon: '🛡️',
    tasks: ['smoke-detectors', 'buy-smoke-detector-batteries', 'buy-fire-extinguisher', 'buy-carbon-monoxide-detector']
  },
  {
    id: 'basic-toolkit',
    name: 'Basic Home Toolkit',
    description: 'Essential tools every homeowner needs',
    icon: '🔨',
    tasks: ['buy-drill-bits', 'buy-screwdriver-set', 'buy-level']
  },
  {
    id: 'new-homeowner',
    name: 'New Homeowner Essentials',
    description: 'Must-have tasks for new homeowners',
    icon: '🏠',
    tasks: ['smoke-detectors', 'buy-fire-extinguisher', 'buy-basic-toolkit', 'hvac-service', 'buy-cleaning-supplies']
  }
];

// Helper functions
export const getTasksByCategory = (category: string, subcategory?: string) => {
  return taskTemplates.filter(task =>
    task.category === category && (!subcategory || task.subcategory === subcategory)
  );
};

export const getTasksByListType = (listType: 'maintenance' | 'projects' | 'shopping') => {
  return taskTemplates.filter(task => task.list_type === listType);
};

export const getSeasonalTasks = (season: 'spring' | 'summer' | 'fall' | 'winter') => {
  return taskTemplates.filter(task => task.season === season);
};

export const searchTasks = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return taskTemplates.filter(task =>
    task.title.toLowerCase().includes(lowerQuery) ||
    task.description?.toLowerCase().includes(lowerQuery) ||
    task.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

export const getTaskBundle = (bundleId: string) => {
  const bundle = taskBundles.find(b => b.id === bundleId);
  if (!bundle) return null;

  const tasks = bundle.tasks.map(taskId =>
    taskTemplates.find(t => t.id === taskId)
  ).filter(Boolean) as TaskTemplate[];

  return { ...bundle, taskTemplates: tasks };
};
