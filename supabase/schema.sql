-- WedSite Database Schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wedding websites table
CREATE TABLE IF NOT EXISTS public.wedding_sites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  template TEXT DEFAULT 'classic',
  custom_domain TEXT UNIQUE,
  is_published BOOLEAN DEFAULT FALSE,
  theme_colors JSONB DEFAULT '{}',
  sections JSONB DEFAULT '[]',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RSVP responses table
CREATE TABLE IF NOT EXISTS public.rsvp_responses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  wedding_site_id UUID REFERENCES public.wedding_sites(id) ON DELETE CASCADE NOT NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT,
  guest_phone TEXT,
  attendance_status TEXT CHECK (attendance_status IN ('attending', 'not_attending', 'maybe')),
  number_of_guests INTEGER DEFAULT 1,
  dietary_requirements TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'THB',
  status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  plan TEXT CHECK (plan IN ('free', 'pro')),
  payment_method TEXT,
  transaction_id TEXT UNIQUE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics table
CREATE TABLE IF NOT EXISTS public.analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  wedding_site_id UUID REFERENCES public.wedding_sites(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvp_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Wedding sites policies
CREATE POLICY "Users can view own wedding sites"
  ON public.wedding_sites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create wedding sites"
  ON public.wedding_sites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wedding sites"
  ON public.wedding_sites FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own wedding sites"
  ON public.wedding_sites FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Published sites are viewable by anyone"
  ON public.wedding_sites FOR SELECT
  USING (is_published = TRUE);

-- RSVP policies
CREATE POLICY "Anyone can create RSVP"
  ON public.rsvp_responses FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Site owners can view RSVPs"
  ON public.rsvp_responses FOR SELECT
  USING (
    wedding_site_id IN (
      SELECT id FROM public.wedding_sites WHERE user_id = auth.uid()
    )
  );

-- Payments policies
CREATE POLICY "Users can view own payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id);

-- Analytics policies
CREATE POLICY "Site owners can view analytics"
  ON public.analytics FOR SELECT
  USING (
    wedding_site_id IN (
      SELECT id FROM public.wedding_sites WHERE user_id = auth.uid()
    )
  );

-- Functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.wedding_sites
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_wedding_sites_user_id ON public.wedding_sites(user_id);
CREATE INDEX IF NOT EXISTS idx_wedding_sites_slug ON public.wedding_sites(slug);
CREATE INDEX IF NOT EXISTS idx_rsvp_wedding_site_id ON public.rsvp_responses(wedding_site_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_wedding_site_id ON public.analytics(wedding_site_id);
