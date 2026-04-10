/**
 * Seed Script for Supabase
 * 
 * This script creates test users in Supabase
 * Usage: bun run scripts/seed-supabase.ts
 * 
 * Prerequisites:
 * 1. Run the schema.sql in Supabase SQL Editor
 * 2. Set SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.log('\nPlease add:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=your-supabase-url');
  console.log('SUPABASE_SERVICE_ROLE_KEY=your-service-role-key\n');
  process.exit(1);
}

// Create Supabase admin client
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

interface MockUser {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  plan: 'free' | 'pro';
}

const mockUsers: MockUser[] = [
  {
    name: 'สมชาย ใจดี',
    email: 'somchai@test.com',
    password: 'Test1234',
    role: 'user',
    plan: 'free',
  },
  {
    name: 'สมหญิง รักดี',
    email: 'somying@test.com',
    password: 'Test1234',
    role: 'user',
    plan: 'free',
  },
  {
    name: 'ธนพล มั่งมี',
    email: 'thanapol@test.com',
    password: 'Test1234',
    role: 'user',
    plan: 'pro',
  },
  {
    name: 'Admin WedSite',
    email: 'admin@wedsite.com',
    password: 'Admin1234',
    role: 'admin',
    plan: 'pro',
  },
];

async function createUser(user: MockUser) {
  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: {
        name: user.name,
      },
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        return { exists: true };
      }
      throw authError;
    }

    // Update profile with role and plan
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          role: user.role,
          plan: user.plan,
        })
        .eq('id', authData.user.id);

      if (profileError) {
        console.warn(`⚠️  Warning: Could not update profile for ${user.email}:`, profileError.message);
      }
    }

    return { success: true, user: authData.user };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create user');
  }
}

async function seedUsers() {
  console.log('\n🌱 Starting to seed Supabase users...\n');
  console.log(`📡 Supabase URL: ${supabaseUrl}\n`);
  console.log('━'.repeat(60));

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const user of mockUsers) {
    try {
      console.log(`\n📝 Creating user: ${user.name} (${user.email})`);

      const result = await createUser(user);

      if (result.exists) {
        console.log(`⏭️  User already exists, skipping...`);
        skipped++;
      } else {
        console.log(`✅ Created successfully!`);
        console.log(`   Role: ${user.role}, Plan: ${user.plan}`);
        console.log(`   Password: ${user.password}`);
        created++;
      }
    } catch (error: any) {
      console.log(`❌ Failed: ${error.message}`);
      failed++;
    }
  }

  console.log('\n' + '━'.repeat(60));
  console.log('\n📊 Summary:');
  console.log(`   ✅ Created: ${created}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Failed: ${failed}`);

  if (created > 0 || skipped > 0) {
    console.log('\n✨ Seeding completed!\n');
    console.log('📝 You can now login with these credentials:');
    console.log('   - somchai@test.com / Test1234 (Free User)');
    console.log('   - thanapol@test.com / Test1234 (Pro User)');
    console.log('   - admin@wedsite.com / Admin1234 (Admin)\n');
    console.log('🔗 Supabase Dashboard:', supabaseUrl.replace('.supabase.co', '.supabase.co/project/_/auth/users'));
    console.log('🔗 Test users page: http://localhost:3000/test-users\n');
  } else if (failed > 0) {
    console.log('\n❌ Seeding failed. Please check:');
    console.log('   1. Is the schema.sql executed in Supabase?');
    console.log('   2. Is SUPABASE_SERVICE_ROLE_KEY correct?');
    console.log('   3. Check the error messages above\n');
    process.exit(1);
  }
}

// Run the seed function
seedUsers().catch((error) => {
  console.error('\n❌ Fatal error:', error.message);
  console.log('\n💡 Troubleshooting:');
  console.log('   1. Run schema.sql in Supabase SQL Editor first');
  console.log('   2. Get Service Role Key from Supabase Dashboard > Settings > API');
  console.log('   3. Add it to .env.local as SUPABASE_SERVICE_ROLE_KEY\n');
  process.exit(1);
});
