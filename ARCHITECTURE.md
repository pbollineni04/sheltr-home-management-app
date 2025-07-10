# Sheltr - Architecture Documentation

## Project Structure

This project follows a feature-based architecture where related components, hooks, types, and utilities are grouped together by feature domain.

### Directory Structure

```
src/
├── components/           # Shared/common components
│   ├── ui/              # UI component library (shadcn/ui)
│   ├── Navigation.tsx   # App navigation
│   ├── ProtectedRoute.tsx
│   └── ThemeProvider.tsx
├── features/            # Feature-based modules
│   ├── alerts/          # Smart alerts & predictive maintenance
│   ├── dashboard/       # Dashboard overview
│   ├── documents/       # Document vault
│   ├── energy/          # Energy tracking
│   ├── expenses/        # Expense tracking
│   ├── helper/          # AI helper
│   ├── move/            # Move in/out management
│   ├── tasks/           # Task management
│   ├── timeline/        # Home timeline
│   └── warranty/        # Warranty vault
├── contexts/            # React contexts
├── hooks/               # Shared hooks
├── lib/                 # Utility libraries
├── pages/               # Page components
└── integrations/        # External service integrations
```

### Feature Module Structure

Each feature module follows this structure:

```
feature/
├── components/          # Feature-specific components
│   ├── FeatureMain.tsx  # Main feature component
│   ├── SubComponent.tsx # Sub-components
│   └── subcomponents/   # Nested sub-components
├── hooks/               # Feature-specific hooks
├── types/               # Feature-specific types
├── utils/               # Feature-specific utilities
├── data/                # Static data and constants
└── index.ts             # Feature exports
```

### Benefits of This Structure

1. **Modularity**: Each feature is self-contained with its own components, hooks, and utilities
2. **Maintainability**: Easy to locate and modify feature-specific code
3. **Scalability**: New features can be added without affecting existing ones
4. **Reusability**: Common components remain in the shared components directory
5. **Clear Dependencies**: Import paths clearly show feature relationships

### Import Patterns

- **Feature imports**: `import { ComponentName } from '@/features/featureName'`
- **Shared components**: `import { ComponentName } from '@/components/ui/componentName'`
- **Utilities**: `import { utilityName } from '@/lib/utils'`

### Adding New Features

1. Create a new directory under `src/features/`
2. Follow the standard feature module structure
3. Create an `index.ts` file to export public APIs
4. Update the main navigation and routing as needed

### Migration Notes

This refactoring maintains all existing functionality while improving code organization. All import paths have been updated to reflect the new structure.