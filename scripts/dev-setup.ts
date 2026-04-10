/**
 * Development Setup Script
 * 
 * This script runs automatically before dev server starts
 * It will:
 * 1. Check database connection
 * 2. Generate Prisma Client
 * 3. Seed test users (if needed)
 */

import { spawn } from 'child_process';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

function log(message: string, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function runCommand(command: string, args: string[] = []): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function checkDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    log('\n⚠️  DATABASE_URL not found in .env.local', colors.yellow);
    log('   Skipping Prisma setup. Using Better Auth + SQLite instead.\n', colors.yellow);
    return false;
  }

  if (databaseUrl.includes('[YOUR-PASSWORD]')) {
    log('\n⚠️  DATABASE_URL contains placeholder [YOUR-PASSWORD]', colors.yellow);
    log('   Please update .env.local with your actual database password.\n', colors.yellow);
    return false;
  }

  return true;
}

async function setup() {
  log('\n🚀 Starting development setup...\n', colors.bright);

  try {
    // Check if DATABASE_URL is configured
    const hasDatabaseUrl = await checkDatabaseUrl();

    if (hasDatabaseUrl) {
      // Generate Prisma Client
      log('📦 Generating Prisma Client...', colors.blue);
      await runCommand('bunx', ['prisma', 'generate']);
      log('✅ Prisma Client generated\n', colors.green);

      // Seed database
      log('🌱 Seeding database...', colors.blue);
      try {
        await runCommand('bun', ['run', 'scripts/seed-prisma.ts']);
        log('✅ Database seeded\n', colors.green);
      } catch (error) {
        log('⚠️  Seeding skipped (users may already exist)\n', colors.yellow);
      }
    }

    log('✨ Setup complete! Starting dev server...\n', colors.green);
  } catch (error: any) {
    log(`\n❌ Setup failed: ${error.message}`, colors.red);
    log('⚠️  Continuing with dev server anyway...\n', colors.yellow);
  }
}

// Run setup
setup();
