# Landing Page Screenshot Guide

## Screenshots Needed

The landing page has placeholders for the following screenshots:

### 1. Hero Section
**Location**: `src/components/landing/HeroSection.tsx` (line ~47)
- **What to capture**: Dashboard overview showing all 4 stat cards
- **Recommended size**: 1200x900px (4:3 aspect ratio)
- **How to add**:
  1. Navigate to http://localhost:8080/dashboard
  2. Take screenshot of dashboard
  3. Save to `/public/screenshots/dashboard-hero.png`
  4. Replace the placeholder div with:
     ```tsx
     <img
       src="/screenshots/dashboard-hero.png"
       alt="Sheltr Dashboard"
       className="w-full h-full object-cover"
     />
     ```

### 2. Feature Screenshots (4 total)
**Location**: `src/components/landing/FeaturesSection.tsx` (line ~65)

#### Expense Tracking
- Navigate to Expenses tab
- Show budget progress and expense list
- Save to `/public/screenshots/feature-expenses.png`

#### Task Management
- Navigate to Tasks tab
- Show task lists with multiple items
- Save to `/public/screenshots/feature-tasks.png`

#### Timeline
- Navigate to Timeline tab
- Show timeline with several events
- Save to `/public/screenshots/feature-timeline.png`

#### Documents
- Navigate to Documents tab
- Show document library with files
- Save to `/public/screenshots/feature-documents.png`

## Adding Screenshots to Components

### For Hero Section:
Replace placeholder in `HeroSection.tsx`:
```tsx
<div className="aspect-[4/3] relative">
  <img
    src="/screenshots/dashboard-hero.png"
    alt="Sheltr Dashboard Overview"
    className="w-full h-full object-cover rounded-lg"
  />
</div>
```

### For Feature Cards:
Update `FeaturesSection.tsx` to add images:
```tsx
{/* In the feature map, replace the placeholder div with: */}
<div className="relative h-64 overflow-hidden border-t">
  <img
    src={`/screenshots/feature-${feature.image}.png`}
    alt={`${feature.title} Screenshot`}
    className="w-full h-full object-cover"
  />
</div>
```

## Screenshot Capture Steps

1. **Login to app**: http://localhost:8080/dashboard
2. **Add sample data** if needed (tasks, expenses, documents, timeline events)
3. **Use browser screenshot tools**:
   - Chrome DevTools Device Mode for consistent sizing
   - Or use OS screenshot tool (Cmd+Shift+4 on Mac)
4. **Edit if needed**:
   - Blur sensitive data
   - Add highlight annotations (optional)
   - Optimize file size
5. **Save to** `/public/screenshots/` directory
6. **Update components** to use real images instead of placeholders

## Optional Enhancements

- Add subtle mockup frames (browser window or device frame)
- Add spotlight effects to highlight key features
- Add annotations or callouts for important UI elements
- Consider using a tool like Cleanshot or Figma for professional mockups
