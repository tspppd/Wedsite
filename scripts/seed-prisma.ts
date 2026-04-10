/**
 * Seed Script for Prisma + Supabase
 * 
 * This script creates test users using Prisma ORM
 * Usage: bun run scripts/seed-prisma.ts
 * 
 * Prerequisites:
 * 1. Set DATABASE_URL in .env.local
 * 2. Run: bunx prisma db push (to sync schema)
 * 3. Run: bunx prisma generate (to generate client)
 */

import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

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
  role: 'USER' | 'ADMIN';
  plan: 'FREE' | 'PRO';
}

const mockUsers: MockUser[] = [
  {
    name: 'สมชาย ใจดี',
    email: 'somchai@test.com',
    password: 'Test1234',
    role: 'USER',
    plan: 'FREE',
  },
  {
    name: 'สมหญิง รักดี',
    email: 'somying@test.com',
    password: 'Test1234',
    role: 'USER',
    plan: 'FREE',
  },
  {
    name: 'ธนพล มั่งมี',
    email: 'thanapol@test.com',
    password: 'Test1234',
    role: 'USER',
    plan: 'PRO',
  },
  {
    name: 'Admin WedSite',
    email: 'admin@wedsite.com',
    password: 'Admin1234',
    role: 'ADMIN',
    plan: 'PRO',
  },
];

async function createUser(user: MockUser) {
  try {
    // Create auth user in Supabase
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

    if (!authData.user) {
      throw new Error('Failed to create auth user');
    }

    // Create/Update profile in Prisma
    const profile = await prisma.profile.upsert({
      where: { id: authData.user.id },
      update: {
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
      },
      create: {
        id: authData.user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
      },
    });

    return { success: true, profile };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create user');
  }
}

async function seedUsers() {
  console.log('\n🌱 Starting to seed users with Prisma...\n');
  console.log(`📡 Database: Supabase (PostgreSQL)`);
  console.log(`🔧 ORM: Prisma\n`);
  console.log('━'.repeat(60));

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const user of mockUsers) {
    try {
      // Check if user already exists in Supabase Auth
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const userExists = existingUsers?.users?.some(u => u.email === user.email);

      if (userExists) {
        console.log(`\n⏭️  User ${user.email} already exists, skipping...`);
        skipped++;
        continue;
      }

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
    
    if (created > 0) {
      console.log('📝 You can now login with these credentials:');
      console.log('   - somchai@test.com / Test1234 (Free User)');
      console.log('   - thanapol@test.com / Test1234 (Pro User)');
      console.log('   - admin@wedsite.com / Admin1234 (Admin)\n');
    }
    
    // Show some stats
    try {
      const totalProfiles = await prisma.profile.count();
      const freeUsers = await prisma.profile.count({ where: { plan: 'FREE' } });
      const proUsers = await prisma.profile.count({ where: { plan: 'PRO' } });
      
      console.log('📊 Database Stats:');
      console.log(`   Total Profiles: ${totalProfiles}`);
      console.log(`   Free Users: ${freeUsers}`);
      console.log(`   Pro Users: ${proUsers}\n`);
    } catch (error) {
      // Ignore stats errors
    }
  } else if (failed > 0) {
    console.log('\n❌ Seeding failed. Please check:');
    console.log('   1. Is DATABASE_URL set correctly?');
    console.log('   2. Did you run: bunx prisma db push?');
    console.log('   3. Did you run: bunx prisma generate?\n');
    process.exit(1);
  }
}

// Run the seed function
seedUsers()
  .catch((error) => {
    console.error('\n❌ Fatal error:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Set DATABASE_URL in .env.local');
    console.log('   2. Run: bunx prisma db push');
    console.log('   3. Run: bunx prisma generate\n');
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
