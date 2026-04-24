-- Migration: Clean Schema for Supabase Auth
-- Run this in Supabase SQL Editor

-- ============================================
-- Drop old Better Auth tables
-- ============================================
DROP TABLE IF EXISTS "account" CASCADE;
DROP TABLE IF EXISTS "session" CASCADE;

-- ============================================
-- Recreate profiles table with correct structure
-- ============================================
DROP TABLE IF EXISTS "profiles" CASCADE;

CREATE TABLE "profiles" (
  "id" UUID PRIMARY KEY,
  "email" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'user',
  "plan" TEXT NOT NULL DEFAULT 'free',
  "avatar_url" TEXT,
  "email_verified" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW()
);

-- ============================================
-- Create wedding_sites table
-- ============================================
DROP TABLE IF EXISTS "wedding_sites" CASCADE;

CREATE TABLE "wedding_sites" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT UNIQUE NOT NULL,
  "groom_name" TEXT,
  "bride_name" TEXT,
  "wedding_date" DATE,
  "template" TEXT NOT NULL DEFAULT 'classic',
  "custom_domain" TEXT UNIQUE,
  "is_published" BOOLEAN NOT NULL DEFAULT false,
  "theme_colors" JSONB NOT NULL DEFAULT '{}',
  "sections" JSONB NOT NULL DEFAULT '[]',
  "settings" JSONB NOT NULL DEFAULT '{}',
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  CONSTRAINT "wedding_sites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE
);

CREATE INDEX "wedding_sites_user_id_idx" ON "wedding_sites"("user_id");
CREATE INDEX "wedding_sites_slug_idx" ON "wedding_sites"("slug");
CREATE INDEX "wedding_sites_is_published_idx" ON "wedding_sites"("is_published");

-- ============================================
-- Create rsvp_responses table
-- ============================================
DROP TABLE IF EXISTS "rsvp_responses" CASCADE;

CREATE TABLE "rsvp_responses" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "wedding_site_id" UUID NOT NULL,
  "guest_name" TEXT NOT NULL,
  "guest_email" TEXT,
  "guest_phone" TEXT,
  "attendance_status" TEXT NOT NULL,
  "number_of_guests" INTEGER NOT NULL DEFAULT 1,
  "dietary_requirements" TEXT,
  "message" TEXT,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  CONSTRAINT "rsvp_responses_wedding_site_id_fkey" FOREIGN KEY ("wedding_site_id") REFERENCES "wedding_sites"("id") ON DELETE CASCADE
);

CREATE INDEX "rsvp_responses_wedding_site_id_idx" ON "rsvp_responses"("wedding_site_id");
CREATE INDEX "rsvp_responses_guest_email_idx" ON "rsvp_responses"("guest_email");

-- ============================================
-- Create payments table
-- ============================================
DROP TABLE IF EXISTS "payments" CASCADE;

CREATE TABLE "payments" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL,
  "amount" DECIMAL(10, 2) NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'THB',
  "status" TEXT NOT NULL,
  "plan" TEXT NOT NULL,
  "payment_method" TEXT,
  "transaction_id" TEXT UNIQUE,
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE
);

CREATE INDEX "payments_user_id_idx" ON "payments"("user_id");
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- ============================================
-- Create analytics table
-- ============================================
DROP TABLE IF EXISTS "analytics" CASCADE;

CREATE TABLE "analytics" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "wedding_site_id" UUID NOT NULL,
  "event_type" TEXT NOT NULL,
  "event_data" JSONB NOT NULL DEFAULT '{}',
  "ip_address" TEXT,
  "user_agent" TEXT,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  CONSTRAINT "analytics_wedding_site_id_fkey" FOREIGN KEY ("wedding_site_id") REFERENCES "wedding_sites"("id") ON DELETE CASCADE
);

CREATE INDEX "analytics_wedding_site_id_idx" ON "analytics"("wedding_site_id");
CREATE INDEX "analytics_event_type_idx" ON "analytics"("event_type");
CREATE INDEX "analytics_created_at_idx" ON "analytics"("created_at");

-- ============================================
-- Create updated_at trigger function
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON "profiles";
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON "profiles"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to wedding_sites
DROP TRIGGER IF EXISTS update_wedding_sites_updated_at ON "wedding_sites";
CREATE TRIGGER update_wedding_sites_updated_at
  BEFORE UPDATE ON "wedding_sites"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Comments
-- ============================================
COMMENT ON TABLE "profiles" IS 'User profiles extending Supabase auth.users';
COMMENT ON TABLE "wedding_sites" IS 'Wedding website configurations';
COMMENT ON TABLE "rsvp_responses" IS 'Guest RSVP submissions';
COMMENT ON TABLE "payments" IS 'Payment transactions for pro plans';
COMMENT ON TABLE "analytics" IS 'Website analytics and tracking';

COMMENT ON COLUMN "profiles"."role" IS 'User role: user or admin';
COMMENT ON COLUMN "profiles"."plan" IS 'Subscription plan: free or pro';
COMMENT ON COLUMN "wedding_sites"."is_published" IS 'Whether the site is publicly accessible';
COMMENT ON COLUMN "rsvp_responses"."attendance_status" IS 'attending, not_attending, or maybe';
COMMENT ON COLUMN "payments"."status" IS 'pending, completed, failed, or refunded';
