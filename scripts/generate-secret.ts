/**
 * Generate Better Auth Secret Key
 * 
 * This script generates a secure random secret key for Better Auth
 * Usage: bun run scripts/generate-secret.ts
 */

import { randomBytes } from 'crypto';

function generateSecret(length: number = 32): string {
  return randomBytes(length).toString('base64url');
}

console.log('\n🔐 Better Auth Secret Key Generator\n');
console.log('━'.repeat(60));

// Generate multiple keys for different purposes
const authSecret = generateSecret(32);
const jwtSecret = generateSecret(32);
const encryptionKey = generateSecret(32);

console.log('\n📝 Copy these to your .env.local file:\n');

console.log('# Better Auth Secret (Required)');
console.log(`BETTER_AUTH_SECRET=${authSecret}`);

console.log('\n# Optional: JWT Secret');
console.log(`JWT_SECRET=${jwtSecret}`);

console.log('\n# Optional: Encryption Key');
console.log(`ENCRYPTION_KEY=${encryptionKey}`);

console.log('\n━'.repeat(60));
console.log('\n✅ Secrets generated successfully!');
console.log('\n💡 Tips:');
console.log('   - Keep these secrets safe and never commit them to git');
console.log('   - Use different secrets for development and production');
console.log('   - Rotate secrets periodically for better security\n');
