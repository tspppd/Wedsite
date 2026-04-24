# 👑 Admin Guide

## 🎯 Admin Features Overview

ระบบมี admin role สำหรับจัดการ users และ wedding sites

---

## 🔐 Admin Role

### Role Types
- `USER` - ผู้ใช้ทั่วไป (default)
- `ADMIN` - ผู้ดูแลระบบ

---

## 🚀 Setup Admin User

### Method 1: SQL Editor (แนะนำ)
```sql
-- ใน Supabase Dashboard → SQL Editor
UPDATE profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

### Method 2: Prisma Studio
```bash
# เปิด Prisma Studio
bunx prisma studio

# ไปที่ profiles table
# แก้ไข role จาก 'user' เป็น 'admin'
```

### Method 3: API (ต้องมี admin อยู่แล้ว)
```typescript
// POST /api/admin/set-role
{
  "userId": "user-uuid",
  "role": "admin"
}
```

---

## 📝 Admin API Routes

### Check Admin Status
```typescript
// GET /api/admin/check
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return Response.json({ isAdmin: false });
  }
  
  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: { role: true }
  });
  
  return Response.json({
    isAdmin: profile?.role === 'ADMIN'
  });
}
```

### Get All Users (Admin Only)
```typescript
// GET /api/admin/users
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Check admin
  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: { role: true }
  });
  
  if (profile?.role !== 'ADMIN') {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  // Get all users
  const users = await prisma.profile.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      plan: true,
      createdAt: true,
      _count: {
        select: {
          weddingSites: true,
          payments: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  
  return Response.json(users);
}
```

### Set User Role (Admin Only)
```typescript
// POST /api/admin/set-role
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Check admin
  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: { role: true }
  });
  
  if (profile?.role !== 'ADMIN') {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  const body = await request.json();
  const { userId, role } = body;
  
  // Validate role
  if (!['USER', 'ADMIN'].includes(role)) {
    return Response.json({ error: 'Invalid role' }, { status: 400 });
  }
  
  // Update role
  const updated = await prisma.profile.update({
    where: { id: userId },
    data: { role }
  });
  
  return Response.json(updated);
}
```

### Get All Wedding Sites (Admin Only)
```typescript
// GET /api/admin/wedding-sites
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Check admin
  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: { role: true }
  });
  
  if (profile?.role !== 'ADMIN') {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  // Get all sites
  const sites = await prisma.weddingSite.findMany({
    include: {
      user: {
        select: {
          email: true,
          name: true
        }
      },
      _count: {
        select: {
          rsvps: true,
          analytics: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  
  return Response.json(sites);
}
```

---

## 🎨 Admin Dashboard Component

### Admin Check Hook
```typescript
// src/hooks/useAdmin.ts
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';

export function useAdmin() {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  
  useEffect(() => {
    if (!loading && user) {
      fetch('/api/admin/check')
        .then(res => res.json())
        .then(data => {
          setIsAdmin(data.isAdmin);
          setChecking(false);
        })
        .catch(() => {
          setIsAdmin(false);
          setChecking(false);
        });
    } else if (!loading) {
      setChecking(false);
    }
  }, [user, loading]);
  
  return { isAdmin, checking };
}
```

### Admin Dashboard Page
```typescript
// src/app/admin/page.tsx
'use client';

import { useAdmin } from '@/hooks/useAdmin';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  plan: string;
  createdAt: string;
  _count: {
    weddingSites: number;
    payments: number;
  };
}

export default function AdminDashboard() {
  const { isAdmin, checking } = useAdmin();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!checking && !isAdmin) {
      router.push('/');
    }
  }, [isAdmin, checking, router]);
  
  useEffect(() => {
    if (isAdmin) {
      fetch('/api/admin/users')
        .then(res => res.json())
        .then(data => {
          setUsers(data);
          setLoading(false);
        });
    }
  }, [isAdmin]);
  
  if (checking || loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAdmin) {
    return null;
  }
  
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Users</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Role</th>
                  <th className="text-left p-2">Plan</th>
                  <th className="text-left p-2">Sites</th>
                  <th className="text-left p-2">Payments</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b">
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">{user.name}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.role === 'ADMIN' 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.plan === 'PRO' 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {user.plan}
                      </span>
                    </td>
                    <td className="p-2">{user._count.weddingSites}</td>
                    <td className="p-2">{user._count.payments}</td>
                    <td className="p-2">
                      <button
                        onClick={() => handleSetRole(user.id, user.role === 'ADMIN' ? 'USER' : 'ADMIN')}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Toggle Admin
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
  
  async function handleSetRole(userId: string, newRole: string) {
    const response = await fetch('/api/admin/set-role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, role: newRole })
    });
    
    if (response.ok) {
      // Refresh users
      const data = await fetch('/api/admin/users').then(r => r.json());
      setUsers(data);
    }
  }
}
```

---

## 🔒 Admin-Only Routes

### Protect Admin Routes
```typescript
// src/middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
        },
      }
    );
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Check admin role (you'll need to query database here)
    // For now, just check if user exists
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
```

---

## 📊 Admin Statistics

### Get System Stats
```typescript
// GET /api/admin/stats
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Check admin
  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: { role: true }
  });
  
  if (profile?.role !== 'ADMIN') {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  // Get stats
  const [
    totalUsers,
    totalSites,
    totalRsvps,
    totalPayments,
    proUsers,
    publishedSites
  ] = await Promise.all([
    prisma.profile.count(),
    prisma.weddingSite.count(),
    prisma.rsvpResponse.count(),
    prisma.payment.count(),
    prisma.profile.count({ where: { plan: 'PRO' } }),
    prisma.weddingSite.count({ where: { isPublished: true } })
  ]);
  
  return Response.json({
    totalUsers,
    totalSites,
    totalRsvps,
    totalPayments,
    proUsers,
    publishedSites
  });
}
```

---

## ✅ Admin Checklist

### Setup
- [ ] สร้าง admin user ใน database
- [ ] ทดสอบ admin check API
- [ ] สร้าง admin dashboard page
- [ ] สร้าง admin API routes
- [ ] เพิ่ม middleware protection

### Features
- [ ] View all users
- [ ] Set user roles
- [ ] View all wedding sites
- [ ] View system statistics
- [ ] Manage payments
- [ ] View analytics

### Security
- [ ] RLS policies สำหรับ admin
- [ ] API route protection
- [ ] Frontend route protection
- [ ] Audit logging (optional)

---

## 🎯 Best Practices

1. **Always check admin role** ใน API routes
2. **Use RLS policies** สำหรับ database security
3. **Log admin actions** สำหรับ audit trail
4. **Limit admin users** มีแค่คนที่จำเป็นเท่านั้น
5. **Use environment variables** สำหรับ sensitive data

---

**Admin system ready! 👑**
