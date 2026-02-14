# Energy/Utilities Tracking Feature

## Overview

A comprehensive energy and utilities tracking system that allows users to monitor their electricity, gas, water, and internet usage, costs, and environmental impact.

## Features

- ✅ Manual utility reading entry
- ✅ Multiple utility types (electricity, gas, water, internet)
- ✅ Period filtering (month, quarter, year)
- ✅ Trend analysis and comparisons
- ✅ Carbon footprint calculation
- ✅ Efficiency scoring
- ✅ Visual charts (usage, cost breakdown, trends)
- ✅ Timeline integration for high-cost readings
- 🚧 Utility API integration (Phase 4)
- 🚧 Auto-import from utility bills (Phase 4)
- 🚧 Dynamic efficiency tips (Phase 5)
- 🚧 Anomaly detection (Phase 5)

## Architecture

```
/src/features/energy/
├── types/
│   └── index.ts              # TypeScript interfaces and types
├── services/
│   └── energyService.ts      # Business logic and API calls
├── hooks/
│   └── useUtilityReadings.ts # State management hook
└── components/
    ├── EnergyTracker.tsx            # Main component
    ├── AddReadingDialog.tsx         # Manual entry form
    ├── UsageChart.tsx               # Line chart
    ├── CostBreakdownChart.tsx       # Pie chart
    └── TrendComparisonChart.tsx     # Bar chart
```

## Usage

### Basic Usage

```tsx
import EnergyTracker from '@/features/energy/components/EnergyTracker';

function MyComponent() {
  return <EnergyTracker />;
}
```

### Using the Hook

```tsx
import { useUtilityReadings } from '@/features/energy/hooks/useUtilityReadings';

function MyComponent() {
  const {
    readings,
    loading,
    selectedPeriod,
    setSelectedPeriod,
    addReading,
    updateReading,
    deleteReading,
    metrics,
    sustainabilityMetrics,
    costSummary,
  } = useUtilityReadings();

  // Your component logic
}
```

### Using the Service Directly

```tsx
import { EnergyService } from '@/features/energy/services/energyService';

// Create a reading
const reading = await EnergyService.createReading({
  utility_type: 'electricity',
  usage_amount: 850,
  unit: 'kWh',
  cost: 127.50,
  reading_date: '2026-02-06',
});

// Get readings by period
const monthlyReadings = await EnergyService.getReadingsByPeriod('month');

// Calculate sustainability metrics
const metrics = await EnergyService.getSustainabilityMetrics('month');
```

## API Reference

### Types

#### `UtilityType`
```typescript
type UtilityType = 'electricity' | 'gas' | 'water' | 'internet';
```

#### `Period`
```typescript
type Period = 'month' | 'quarter' | 'year';
```

#### `TrendData`
```typescript
interface TrendData {
  utilityType: UtilityType;
  currentUsage: number;
  previousUsage: number;
  currentCost: number;
  previousCost: number;
  usageTrendPercent: number;
  costTrendPercent: number;
  trendDirection: 'up' | 'down' | 'stable';
}
```

#### `CostSummary`
```typescript
interface CostSummary {
  totalCost: number;
  costByUtility: Record<UtilityType, number>;
  usageByUtility: Record<UtilityType, number>;
  percentageChange: number;
  previousPeriodCost: number;
}
```

#### `SustainabilityMetrics`
```typescript
interface SustainabilityMetrics {
  carbonFootprint: number;      // tons CO2
  carbonReduction: number;       // percentage vs previous period
  renewablePercent: number;      // solar generation / electricity usage
  efficiencyScore: number;       // 0-100 based on historical averages
}
```

### EnergyService Methods

#### `createReading(reading: UtilityReadingInsert): Promise<UtilityReadingRow>`
Creates a new utility reading. Auto-creates timeline entry for readings with cost ≥ $200.

#### `getReadingsByPeriod(period: Period): Promise<UtilityReadingRow[]>`
Retrieves readings for the specified period (month, quarter, or year).

#### `getReadingsByDateRange(startDate: string, endDate: string, utilityType?: UtilityType): Promise<UtilityReadingRow[]>`
Retrieves readings within a custom date range, optionally filtered by utility type.

#### `updateReading(id: string, updates: Partial<UtilityReadingInsert>): Promise<UtilityReadingRow>`
Updates an existing utility reading.

#### `deleteReading(id: string): Promise<void>`
Deletes a utility reading.

#### `calculateTrends(readings: UtilityReadingRow[]): TrendData[]`
Calculates usage and cost trends by comparing consecutive readings.

#### `getCostSummary(period: Period): Promise<CostSummary>`
Retrieves cost breakdown and comparison for the specified period.

#### `calculateCarbonFootprint(readings: UtilityReadingRow[]): number`
Calculates total carbon emissions (in tons CO2) from readings.

#### `calculateEfficiencyScore(currentReadings: UtilityReadingRow[], historicalReadings: UtilityReadingRow[]): Promise<number>`
Calculates efficiency score (0-100) based on historical comparison.

#### `getSustainabilityMetrics(period: Period): Promise<SustainabilityMetrics>`
Retrieves comprehensive sustainability metrics for the period.

#### `createTimelineFromReading(readingId: string): Promise<void>`
Creates a timeline entry for a high-cost utility reading.

### useUtilityReadings Hook

Returns:
```typescript
{
  readings: UtilityReadingRow[];
  loading: boolean;
  selectedPeriod: Period;
  setSelectedPeriod: (period: Period) => void;
  addReading: (reading: UtilityReadingInsert) => Promise<boolean>;
  updateReading: (id: string, updates: Partial<UtilityReadingInsert>) => Promise<boolean>;
  deleteReading: (id: string) => Promise<boolean>;
  refetch: () => Promise<void>;
  metrics: {
    trends: TrendData[];
    carbonFootprint: number;
    totalCost: number;
    averageUsage: number;
  };
  sustainabilityMetrics: SustainabilityMetrics | null;
  costSummary: CostSummary | null;
}
```

## Constants

### Carbon Conversion Factors
```typescript
export const CARBON_FACTORS = {
  electricity: 0.00046, // tons CO2 per kWh
  gas: 0.00585,         // tons CO2 per therm
  water: 0.000001,      // tons CO2 per gallon
  internet: 0,          // no direct emissions
};
```

### Default Units
```typescript
export const DEFAULT_UNITS: Record<UtilityType, string> = {
  electricity: 'kWh',
  gas: 'therms',
  water: 'gallons',
  internet: 'GB',
};
```

### Available Units
```typescript
export const AVAILABLE_UNITS: Record<UtilityType, string[]> = {
  electricity: ['kWh'],
  gas: ['therms', 'CCF'],
  water: ['gallons', 'cubic feet'],
  internet: ['GB', 'TB'],
};
```

## Database Schema

### Table: `utility_readings`

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | User reference (FK) |
| utility_type | enum | Type of utility |
| usage_amount | decimal | Amount used |
| unit | text | Unit of measurement |
| cost | decimal | Cost (optional) |
| reading_date | date | Date of reading |
| trend_direction | text | 'up', 'down', or 'stable' |
| trend_percent | decimal | Percentage change |
| created_at | timestamp | Record creation time |
| updated_at | timestamp | Record update time |

### Indexes
- `idx_utility_readings_user_date` on `(user_id, reading_date DESC, utility_type)`
- `idx_utility_readings_user_type` on `(user_id, utility_type, reading_date DESC)`

### RLS Policies
- Users can only view/modify their own readings
- All operations scoped to `auth.uid()`

## Calculations

### Trend Direction
```
avgPercent = (usageTrendPercent + costTrendPercent) / 2
if avgPercent > 2: 'up'
else if avgPercent < -2: 'down'
else: 'stable'
```

### Efficiency Score
```
score = 50 + ((avgHistorical - avgCurrent) / avgHistorical) * 100
score = Math.max(0, Math.min(100, score))
```

### Carbon Footprint
```
carbon = Σ(usage_amount * CARBON_FACTOR[utility_type])
```

## Testing

See `ENERGY_TRACKER_IMPLEMENTATION.md` for comprehensive testing instructions.

## Future Enhancements

### Phase 4: API Integration
- Connect to UtilityAPI
- Auto-import bills
- Duplicate detection
- Bill parsing with OCR

### Phase 5: Advanced Features
- ML-powered efficiency tips
- Anomaly detection alerts
- Peak hour analysis
- Seasonal comparisons
- CSV/PDF export

### Phase 6: Polish
- Offline support
- Push notifications
- Email reports
- Gamification
- Social comparisons

## Contributing

When adding new features:
1. Update types in `/types/index.ts`
2. Add business logic to service layer
3. Update hook if needed
4. Create/update components
5. Add tests
6. Update this README

## License

Part of the Sheltr Home Management App.
