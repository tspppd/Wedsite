-- Updated Row Level Security (RLS) Policies
-- Run this AFTER migration-clean-schema.sql

-- ============================================
-- Enable RLS on all tables
-- ============================================
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "wedding_sites" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "rsvp_responses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "payments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "analytics" ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Drop existing policies (if any)
-- ============================================
DROP POLICY IF EXISTS "Users can view own profile" ON "profiles";
DROP POLICY IF EXISTS "Users can update own profile" ON "profiles";
DROP POLICY IF EXISTS "Users can insert own profile" ON "profiles";
DROP POLICY IF EXISTS "Admins can view all profiles" ON "profiles";
DROP POLICY IF EXISTS "Admins can update all profiles" ON "profiles";

DROP POLICY IF EXISTS "Users can view own wedding sites" ON "wedding_sites";
DROP POLICY IF EXISTS "Users can create wedding sites" ON "wedding_sites";
DROP POLICY IF EXISTS "Users can update own wedding sites" ON "wedding_sites";
DROP POLICY IF EXISTS "Users can delete own wedding sites" ON "wedding_sites";
DROP POLICY IF EXISTS "Anyone can view published wedding sites" ON "wedding_sites";
DROP POLICY IF EXISTS "Admins can view all wedding sites" ON "wedding_sites";

DROP POLICY IF EXISTS "Anyone can view RSVP responses" ON "rsvp_responses";
DROP POLICY IF EXISTS "Anyone can create RSVP responses" ON "rsvp_responses";
DROP POLICY IF EXISTS "Site owners can update RSVPs" ON "rsvp_responses";
DROP POLICY IF EXISTS "Site owners can delete RSVPs" ON "rsvp_responses";
DROP POLICY IF EXISTS "Admins can manage all RSVPs" ON "rsvp_responses";

DROP POLICY IF EXISTS "Users can view own payments" ON "payments";
DROP POLICY IF EXISTS "Users can create own payments" ON "payments";
DROP POLICY IF EXISTS "Admins can view all payments" ON "payments";

DROP POLICY IF EXISTS "Site owners can view analytics" ON "analytics";
DROP POLICY IF EXISTS "Anyone can create analytics" ON "analytics";
DROP POLICY IF EXISTS "Admins can view all analytics" ON "analytics";

-- ============================================
-- Profiles Policies
-- ============================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON "profiles" FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON "profiles" FOR UPDATE
USING (auth.uid() = id);

-- Users can insert their own profile (for manual creation)
CREATE POLICY "Users can insert own profile"
ON "profiles" FOR INSERT
WITH CHECK (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON "profiles" FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM "profiles"
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles"
ON "profiles" FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM "profiles"
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);

-- ============================================
-- Wedding Sites Policies
-- ============================================

-- Users can view their own wedding sites
CREATE POLICY "Users can view own wedding sites"
ON "wedding_sites" FOR SELECT
USING (auth.uid() = user_id);

-- Users can create wedding sites
CREATE POLICY "Users can create wedding sites"
ON "wedding_sites" FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own wedding sites
CREATE POLICY "Users can update own wedding sites"
ON "wedding_sites" FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own wedding sites
CREATE POLICY "Users can delete own wedding sites"
ON "wedding_sites" FOR DELETE
USING (auth.uid() = user_id);

-- Public can view published wedding sites
CREATE POLICY "Anyone can view published wedding sites"
ON "wedding_sites" FOR SELECT
USING (is_published = true);

-- Admins can view all wedding sites
CREATE POLICY "Admins can view all wedding sites"
ON "wedding_sites" FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM "profiles"
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);

-- ============================================
-- RSVP Responses Policies
-- ============================================

-- Anyone can view RSVP responses for published sites
CREATE POLICY "Anyone can view RSVP responses"
ON "rsvp_responses" FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM "wedding_sites"
    WHERE "wedding_sites".id = "rsvp_responses".wedding_site_id
    AND "wedding_sites".is_published = true
  )
);

-- Anyone can create RSVP responses (for guest submissions)
CREATE POLICY "Anyone can create RSVP responses"
ON "rsvp_responses" FOR INSERT
WITH CHECK (true);

-- Site owners can update RSVPs
CREATE POLICY "Site owners can update RSVPs"
ON "rsvp_responses" FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM "wedding_sites"
    WHERE "wedding_sites".id = "rsvp_responses".wedding_site_id
    AND "wedding_sites".user_id = auth.uid()
  )
);

-- Site owners can delete RSVPs
CREATE POLICY "Site owners can delete RSVPs"
ON "rsvp_responses" FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM "wedding_sites"
    WHERE "wedding_sites".id = "rsvp_responses".wedding_site_id
    AND "wedding_sites".user_id = auth.uid()
  )
);

-- Admins can manage all RSVPs
CREATE POLICY "Admins can manage all RSVPs"
ON "rsvp_responses" FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM "profiles"
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);

-- ============================================
-- Payments Policies
-- ============================================

-- Users can view their own payments
CREATE POLICY "Users can view own payments"
ON "payments" FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own payments
CREATE POLICY "Users can create own payments"
ON "payments" FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can view all payments
CREATE POLICY "Admins can view all payments"
ON "payments" FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM "profiles"
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);

-- ============================================
-- Analytics Policies
-- ============================================

-- Site owners can view analytics
CREATE POLICY "Site owners can view analytics"
ON "analytics" FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM "wedding_sites"
    WHERE "wedding_sites".id = "analytics".wedding_site_id
    AND "wedding_sites".user_id = auth.uid()
  )
);

-- Anyone can create analytics (for tracking)
CREATE POLICY "Anyone can create analytics"
ON "analytics" FOR INSERT
WITH CHECK (true);

-- Admins can view all analytics
CREATE POLICY "Admins can view all analytics"
ON "analytics" FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM "profiles"
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);

-- ============================================
-- Database Functions
-- ============================================

-- Function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, plan)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    'user',
    'free'
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
    SELECT 1 FROM "profiles"
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
    SELECT 1 FROM "profiles"
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
    FROM "wedding_sites"
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to set user role (admin only)
CREATE OR REPLACE FUNCTION public.set_user_role(target_user_id UUID, new_role TEXT)
RETURNS VOID AS $$
BEGIN
  -- Check if caller is admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only admins can set user roles';
  END IF;
  
  -- Validate role
  IF new_role NOT IN ('user', 'admin') THEN
    RAISE EXCEPTION 'Invalid role. Must be user or admin';
  END IF;
  
  -- Update role
  UPDATE "profiles"
  SET role = new_role
  WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Verification Queries
-- ============================================

-- Check if RLS is enabled
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- Check policies
-- SELECT * FROM pg_policies WHERE schemaname = 'public';

-- Test admin functions
-- SELECT public.is_admin();
-- SELECT public.is_pro_user();
-- SELECT public.get_user_site_count();
