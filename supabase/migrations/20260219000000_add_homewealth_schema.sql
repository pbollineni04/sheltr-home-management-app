-- Create property_type enum
CREATE TYPE public.property_type AS ENUM ('single_family', 'multi_family', 'condo', 'townhouse', 'other');

-- Properties table
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  property_type property_type NOT NULL DEFAULT 'single_family',
  year_built INTEGER,
  sqft INTEGER,
  bedrooms INTEGER,
  bathrooms DECIMAL(3,1),
  
  -- Financial details
  purchase_price DECIMAL(12,2),
  purchase_date DATE,
  
  -- Current known details (can be updated by API or manually)
  current_value DECIMAL(12,2),
  current_mortgage_debt DECIMAL(12,2),
  interest_rate DECIMAL(5,3),
  loan_term_years INTEGER DEFAULT 30,
  
  -- Rental info
  monthly_rental_income DECIMAL(10,2),
  estimated_monthly_expenses DECIMAL(10,2),
  
  -- API Caching
  last_avm_sync TIMESTAMP WITH TIME ZONE,
  
  -- Standard metadata
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Property Improvements (ROI tracking) table
CREATE TABLE public.property_improvements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT,
  cost DECIMAL(12,2) NOT NULL,
  estimated_roi DECIMAL(12,2),
  completed BOOLEAN NOT NULL DEFAULT false,
  completion_date DATE,
  is_planned BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Property Value History (for timeline charting)
CREATE TABLE public.property_value_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recorded_date DATE NOT NULL,
  property_value DECIMAL(12,2) NOT NULL,
  mortgage_debt DECIMAL(12,2),
  equity DECIMAL(12,2),
  source TEXT NOT NULL DEFAULT 'manual', -- e.g., 'manual', 'rentcast_api', 'zillow_api'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Comparable Sales
CREATE TABLE public.comparable_sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  sold_price DECIMAL(12,2) NOT NULL,
  sold_date DATE NOT NULL,
  sqft INTEGER,
  price_per_sqft DECIMAL(10,2),
  distance_miles DECIMAL(5,2),
  similarity_score INTEGER,
  source TEXT NOT NULL, 
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Apply auto-update triggers
CREATE TRIGGER trg_properties_updated BEFORE UPDATE ON public.properties FOR EACH ROW EXECUTE FUNCTION public.bump_updated_at();
CREATE TRIGGER trg_property_improvements_updated BEFORE UPDATE ON public.property_improvements FOR EACH ROW EXECUTE FUNCTION public.bump_updated_at();

-- RLS: Enable
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_improvements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_value_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comparable_sales ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Properties
CREATE POLICY "Users can view their own properties" ON public.properties FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own properties" ON public.properties FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own properties" ON public.properties FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own properties" ON public.properties FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies: Improvements
CREATE POLICY "Users can view their own property improvements" ON public.property_improvements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own property improvements" ON public.property_improvements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own property improvements" ON public.property_improvements FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own property improvements" ON public.property_improvements FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies: History
CREATE POLICY "Users can view their own property history" ON public.property_value_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own property history" ON public.property_value_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own property history" ON public.property_value_history FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own property history" ON public.property_value_history FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies: Comps
CREATE POLICY "Users can view their own comps" ON public.comparable_sales FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own comps" ON public.comparable_sales FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own comps" ON public.comparable_sales FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comps" ON public.comparable_sales FOR DELETE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_properties_user_id ON public.properties(user_id);
CREATE INDEX idx_improvements_property_id ON public.property_improvements(property_id);
CREATE INDEX idx_value_history_property_date ON public.property_value_history(property_id, recorded_date DESC);
CREATE INDEX idx_comparable_sales_property_date ON public.comparable_sales(property_id, sold_date DESC);
