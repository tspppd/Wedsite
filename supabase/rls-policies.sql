-- Row Level Security (RLS) Policies for WedSite
-- Run this in Supabase SQL Editor after running prisma db push

-- ============================================
-- Enable RLS on all tables
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvp_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE session ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Profiles Policies
-- ============================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Users can insert their own profile (for manual creation)
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- ============================================
-- Wedding Sites Policies
-- ============================================

-- Users can view their own wedding sites
CREATE POLICY "Users can view own wedding sites"
ON wedding_sites FOR SELECT
USING (auth.uid() = user_id);

-- Users can create wedding sites
CREATE POLICY "Users can create wedding sites"
ON wedding_sites FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own wedding sites
CREATE POLICY "Users can update own wedding sites"
ON wedding_sites FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own wedding sites
CREATE POLICY "Users can delete own wedding sites"
ON wedding_sites FOR DELETE
USING (auth.uid() = user_id);

-- Public can view published wedding sites
CREATE POLICY "Anyone can view published wedding sites"
ON wedding_sites FOR SELECT
USING (is_published = true);

-- ============================================
-- RSVP Responses Policies
-- ============================================

-- Anyone can view RSVP responses (for public RSVP list)
CREATE POLICY "Anyone can view RSVP responses"
ON rsvp_responses FOR SELECT
USING (true);

-- Anyone can create RSVP responses (for guest submissions)
CREATE POLICY "Anyone can create RSVP responses"
ON rsvp_responses FOR INSERT
WITH CHECK (true);

-- Site owners can update RSVPs
CREATE POLICY "Site owners can update RSVPs"
ON rsvp_responses FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM wedding_sites
    WHERE wedding_sites.id = rsvp_responses.wedding_site_id
    AND wedding_sites.user_id = auth.uid()
  )
);

-- Site owners can delete RSVPs
CREATE POLICY "Site owners can delete RSVPs"
ON rsvp_responses FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM wedding_sites
    WHERE wedding_sites.id = rsvp_responses.wedding_site_id
    AND wedding_sites.user_id = auth.uid()
  )
);

-- ============================================
-- Payments Policies
-- ============================================

-- Users can view their own payments
CREATE POLICY "Users can view own payments"
ON payments FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own payments
CREATE POLICY "Users can create own payments"
ON payments FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- Analytics Policies
-- ============================================

-- Site owners can view analytics
CREATE POLICY "Site owners can view analytics"
ON analytics FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM wedding_sites
    WHERE wedding_sites.id = analytics.wedding_site_id
    AND wedding_sites.user_id = auth.uid()
  )
);

-- Anyone can create analytics (for tracking)
CREATE POLICY "Anyone can create analytics"
ON analytics FOR INSERT
WITH CHECK (true);

-- ============================================
-- Session Policies
-- ============================================

-- Users can view their own sessions
CREATE POLICY "Users can view own sessions"
ON session FOR SELECT
USING (auth.uid()::text = user_id::text);

-- Users can create their own sessions
CREATE POLICY "Users can create own sessions"
ON session FOR INSERT
WITH CHECK (auth.uid()::text = user_id::text);

-- Users can update their own sessions
CREATE POLICY "Users can update own sessions"
ON session FOR UPDATE
USING (auth.uid()::text = user_id::text);

-- Users can delete their own sessions
CREATE POLICY "Users can delete own sessions"
ON session FOR DELETE
USING (auth.uid()::text = user_id::text);

-- ============================================
-- Database Functions
-- ============================================

-- Function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, plan, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    'free',
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call handle_new_user function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Utility Functions
-- ============================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is pro
CREATE OR REPLACE FUNCTION public.is_pro_user()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND plan = 'pro'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's wedding site count
CREATE OR REPLACE FUNCTION public.get_user_site_count()
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM wedding_sites
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Indexes for Performance
-- ============================================

-- Already created by Prisma, but here for reference:
-- CREATE INDEX IF NOT EXISTS idx_wedding_sites_user_id ON wedding_sites(user_id);
-- CREATE INDEX IF NOT EXISTS idx_wedding_sites_slug ON wedding_sites(slug);
-- CREATE INDEX IF NOT EXISTS idx_rsvp_responses_wedding_site_id ON rsvp_responses(wedding_site_id);
-- CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
-- CREATE INDEX IF NOT EXISTS idx_analytics_wedding_site_id ON analytics(wedding_site_id);
-- CREATE INDEX IF NOT EXISTS idx_session_user_id ON session(user_id);

-- ============================================
-- Comments
-- ============================================

COMMENT ON TABLE profiles IS 'User profiles extending Supabase auth.users';
COMMENT ON TABLE wedding_sites IS 'Wedding website configurations';
COMMENT ON TABLE rsvp_responses IS 'Guest RSVP submissions';
COMMENT ON TABLE payments IS 'Payment transactions for pro plans';
COMMENT ON TABLE analytics IS 'Website analytics and tracking';
COMMENT ON TABLE session IS 'User session management';

-- ============================================
-- Verification Queries
-- ============================================

-- Check if RLS is enabled
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- Check policies
-- SELECT * FROM pg_policies WHERE schemaname = 'public';

-- Test profile creation trigger
-- SELECT * FROM profiles WHERE id = auth.uid();
