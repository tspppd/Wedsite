# Supabase Authentication Setup

## Overview
ระบบ Authentication ใช้ Supabase Auth แทน Better Auth โดยสมบูรณ์

## Architecture

### Auth Client (`src/lib/auth/client.ts`)
Helper functions สำหรับการทำงานกับ Supabase Auth:
- `signUp()` - สมัครสมาชิกด้วย email/password
- `signIn()` - เข้าสู่ระบบด้วย email/password
- `signInWithGoogle()` - เข้าสู่ระบบด้วย Google OAuth
- `signOut()` - ออกจากระบบ
- `getSession()` - ดึงข้อมูล session ปัจจุบัน
- `getUser()` - ดึงข้อมูล user ปัจจุบัน
- `onAuthStateChange()` - ติดตามการเปลี่ยนแปลงสถานะ auth

### Auth Hook (`src/hooks/useAuth.ts`)
React Hook สำหรับใช้งาน auth ใน components:
```typescript
const { user, loading, isAuthenticated } = useAuth();
```

### OAuth Callback (`src/app/auth/callback/route.ts`)
Route handler สำหรับ OAuth callback (Google login)

## Usage Examples

### 1. Login Page
```typescript
import { auth } from '@/lib/auth/client';

const handleLogin = async (email: string, password: string) => {
  const { data, error } = await auth.signIn(email, password);
  if (error) {
    // Handle error
  } else {
    // Redirect to dashboard
  }
};
```

### 2. Register Page
```typescript
import { auth } from '@/lib/auth/client';

const handleRegister = async (email: string, password: string, name: string) => {
  const { data, error } = await auth.signUp(email, password, name);
  if (error) {
    // Handle error
  } else {
    // Show success message
  }
};
```

### 3. Protected Pages
```typescript
import { useAuth } from '@/hooks/useAuth';

export default function ProtectedPage() {
  const { user, loading } = useAuth();
  
  if (!loading && !user) {
    router.push('/login');
    return null;
  }
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return <div>Protected content</div>;
}
```

### 4. Navbar with Auth
```typescript
import { useAuth } from '@/hooks/useAuth';
import { auth } from '@/lib/auth/client';

export function Navbar() {
  const { user } = useAuth();
  
  const handleLogout = async () => {
    await auth.signOut();
    router.push('/');
  };
  
  return (
    <nav>
      {user ? (
        <>
          <span>{user.email}</span>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <Link href="/login">Login</Link>
      )}
    </nav>
  );
}
```

## User Data Structure

Supabase Auth User object:
```typescript
{
  id: string;
  email: string;
  user_metadata: {
    name?: string;
    // other custom fields
  };
  created_at: string;
  // ... other fields
}
```

## Environment Variables

Required in `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

## Google OAuth Setup

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable Google provider
3. Add your Google OAuth credentials
4. Set redirect URL: `https://your-domain.com/auth/callback`

## Migration from Better Auth

### Removed:
- ❌ Better Auth packages (`better-auth`, `better-call`, `better-sqlite3`)
- ❌ SQLite database (`sqlite.db`)
- ❌ Better Auth client (`@/lib/auth-client`)
- ❌ Seed scripts for Better Auth
- ❌ Auto-seed functionality

### Added:
- ✅ Supabase Auth client (`@/lib/auth/client.ts`)
- ✅ useAuth hook (`@/hooks/useAuth.ts`)
- ✅ OAuth callback route (`@/app/auth/callback/route.ts`)
- ✅ Supabase database integration

## Testing

### Test Users
Visit `/test-users` page to see mockup credentials for testing.

### Manual Testing
1. Register a new account at `/register`
2. Check email for verification (if enabled)
3. Login at `/login`
4. Access protected pages like `/builder`
5. Test logout functionality

## Troubleshooting

### Session not persisting
- Check if cookies are enabled
- Verify Supabase URL and keys in `.env.local`
- Check browser console for errors

### OAuth not working
- Verify Google OAuth credentials in Supabase Dashboard
- Check redirect URL matches your domain
- Ensure callback route is working

### User data not showing
- Check if user_metadata is set during signup
- Use `user.user_metadata.name` to access custom fields
- Fallback to `user.email` if name is not set

## Security Notes

- ✅ Passwords are hashed by Supabase
- ✅ Sessions are stored securely in cookies
- ✅ HTTPS required for production
- ✅ Row Level Security (RLS) enabled on database
- ✅ OAuth tokens handled by Supabase

## Next Steps

1. Configure Google OAuth credentials
2. Set up email templates in Supabase
3. Enable email verification (optional)
4. Add password reset functionality
5. Implement role-based access control
