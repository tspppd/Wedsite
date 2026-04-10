/**
 * Seed Script for Creating Mockup Users via API
 * 
 * This script creates test users by calling the Better Auth API
 * Usage: bun run scripts/seed-users-api.ts
 * 
 * Note: Make sure the dev server is running (bun dev)
 */

interface User {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
  plan?: 'free' | 'pro';
}

const mockUsers: User[] = [
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

const API_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

async function createUser(user: User) {
  try {
    const response = await fetch(`${API_URL}/api/auth/sign-up/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: user.name,
        email: user.email,
        password: user.password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create user');
    }

    return await response.json();
  } catch (error: any) {
    if (error.message?.includes('already exists') || error.message?.includes('duplicate')) {
      return { exists: true };
    }
    throw error;
  }
}

async function seedUsers() {
  console.log('\n🌱 Starting to seed users via API...\n');
  console.log(`📡 API URL: ${API_URL}\n`);
  console.log('⚠️  Make sure the dev server is running (bun dev)\n');
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
    console.log('🔗 Test users page: http://localhost:3000/test-users\n');
  } else if (failed > 0) {
    console.log('\n❌ Seeding failed. Please check:');
    console.log('   1. Is the dev server running? (bun dev)');
    console.log('   2. Is the API URL correct?');
    console.log('   3. Check the error messages above\n');
    process.exit(1);
  }
}

// Run the seed function
seedUsers().catch((error) => {
  console.error('\n❌ Fatal error:', error.message);
  console.log('\n💡 Troubleshooting:');
  console.log('   1. Make sure dev server is running: bun dev');
  console.log('   2. Check if port 3000 is available');
  console.log('   3. Verify .env.local is configured correctly\n');
  process.exit(1);
});
