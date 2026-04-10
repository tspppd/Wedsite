/**
 * Seed Script for Creating Mockup Users
 * 
 * Run this script to create test users in the database
 * Usage: bun run scripts/seed-users.ts
 */

import Database from 'better-sqlite3';
import { hash } from 'bcrypt';

const db = new Database('./sqlite.db');

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

async function seedUsers() {
  console.log('🌱 Starting to seed users...\n');

  try {
    // Check if user table exists
    const tableExists = db
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='user'"
      )
      .get();

    if (!tableExists) {
      console.log('❌ User table does not exist. Please run the app first to create tables.\n');
      process.exit(1);
    }

    for (const user of mockUsers) {
      // Check if user already exists
      const existingUser = db
        .prepare('SELECT * FROM user WHERE email = ?')
        .get(user.email);

      if (existingUser) {
        console.log(`⏭️  User ${user.email} already exists, skipping...`);
        continue;
      }

      // Hash password
      const hashedPassword = await hash(user.password, 10);

      // Insert user
      const result = db
        .prepare(
          `INSERT INTO user (name, email, emailVerified, image, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?)`
        )
        .run(
          user.name,
          user.email,
          new Date().toISOString(),
          null,
          new Date().toISOString(),
          new Date().toISOString()
        );

      // Insert password (if using email/password auth)
      if (result.lastInsertRowid) {
        db.prepare(
          `INSERT INTO password (userId, password)
           VALUES (?, ?)`
        ).run(result.lastInsertRowid, hashedPassword);
      }

      console.log(`✅ Created user: ${user.name} (${user.email})`);
      console.log(`   Role: ${user.role}, Plan: ${user.plan}`);
      console.log(`   Password: ${user.password}\n`);
    }

    console.log('✨ Seeding completed successfully!\n');
    console.log('📝 You can now login with these credentials:');
    console.log('   - somchai@test.com / Test1234 (Free User)');
    console.log('   - thanapol@test.com / Test1234 (Pro User)');
    console.log('   - admin@wedsite.com / Admin1234 (Admin)\n');
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  } finally {
    db.close();
  }
}

// Run the seed function
seedUsers();
