# ⚡ Quick Start Guide

## 🎯 เข้าใจใน 5 นาที

### Supabase vs Prisma คืออะไร?

```
┌─────────────────────────────────────────────┐
│         Supabase Auth                       │
│  (จัดการ Login/Register/Sessions)          │
│                                             │
│  ✅ User สมัครสมาชิก                        │
│  ✅ User เข้าสู่ระบบ                        │
│  ✅ เก็บ session ใน cookies                │
│  ✅ Google OAuth                            │
└─────────────────────────────────────────────┘
                    │
                    │ user.id
                    ▼
┌─────────────────────────────────────────────┐
│         Prisma ORM                          │
│  (จัดการข้อมูลใน Database)                 │
│                                             │
│  ✅ สร้าง/อ่าน/แก้ไข/ลบข้อมูล              │
│  ✅ Query ข้อมูลแบบ type-safe               │
│  ✅ จัดการ relations ระหว่าง tables        │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│      PostgreSQL Database                    │
│      (Hosted by Supabase)                   │
│                                             │
│  📊 เก็บข้อมูลจริงๆ                         │
└─────────────────────────────────────────────┘
```

---

## 📝 ใช้งานอย่างไร?

### 1. Authentication (ใช้ Supabase Auth)

#### Register
```typescript
import { auth } from '@/lib/auth/client';

const { data, error } = await auth.signUp(
  'user@example.com',
  'password123',
  'John Doe'
);
```

#### Login
```typescript
const { data, error } = await auth.signIn(
  'user@example.com',
  'password123'
);
```

#### Check if logged in
```typescript
import { useAuth } from '@/hooks/useAuth';

const { user, loading } = useAuth();

if (user) {
  console.log('Logged in as:', user.email);
}
```

#### Logout
```typescript
await auth.signOut();
```

---

### 2. Database Operations (ใช้ Prisma)

#### Get user profile
```typescript
import { prisma } from '@/lib/prisma';

const profile = await prisma.profile.findUnique({
  where: { id: userId }
});
```

#### Create wedding site
```typescript
const weddingSite = await prisma.weddingSite.create({
  data: {
    userId: user.id,
    title: 'Our Wedding',
    groomName: 'John',
    brideName: 'Jane',
    weddingDate: new Date('2024-12-31'),
    theme: 'romantic'
  }
});
```

#### Get all wedding sites
```typescript
const sites = await prisma.weddingSite.findMany({
  where: { userId: user.id },
  include: {
    rsvpResponses: true // Include related data
  }
});
```

#### Update profile
```typescript
const updated = await prisma.profile.update({
  where: { id: user.id },
  data: { name: 'New Name' }
});
```

#### Delete wedding site
```typescript
await prisma.weddingSite.delete({
  where: { id: siteId }
});
```

---

## 🔐 Protected Pages

```typescript
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  // Show loading
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // Show content only if logged in
  return (
    <div>
      <h1>Welcome {user?.email}</h1>
      {/* Your protected content */}
    </div>
  );
}
```

---

## 🌐 API Routes

### Protected API (ต้อง login)
```typescript
// src/app/api/my-data/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  // 1. Check authentication
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // 2. Query database
  const data = await prisma.weddingSite.findMany({
    where: { userId: user.id }
  });
  
  return NextResponse.json(data);
}
```

### Public API (ไม่ต้อง login)
```typescript
// src/app/api/public-data/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  // No auth check needed
  const data = await prisma.weddingSite.findMany({
    where: { isPublished: true }
  });
  
  return NextResponse.json(data);
}
```

---

## 📁 File Structure

```
src/
├── lib/
│   ├── auth/
│   │   └── client.ts          # ✅ ใช้สำหรับ auth
│   ├── supabase/
│   │   ├── client.ts           # Supabase client (browser)
│   │   └── server.ts           # Supabase client (server)
│   └── prisma.ts               # ✅ ใช้สำหรับ database
│
├── hooks/
│   └── useAuth.ts              # ✅ ใช้ใน components
│
├── app/
│   ├── api/
│   │   └── [...routes]/        # API endpoints
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   └── [...pages]/             # Your pages
│
└── prisma/
    └── schema.prisma           # Database schema
```

---

## 🚀 Common Patterns

### Pattern 1: Fetch data on page load
```typescript
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function MyPage() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  
  useEffect(() => {
    if (user) {
      fetch('/api/my-data')
        .then(res => res.json())
        .then(setData);
    }
  }, [user]);
  
  return <div>{/* Render data */}</div>;
}
```

### Pattern 2: Create data with form
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const response = await fetch('/api/wedding-sites', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  
  const newSite = await response.json();
  console.log('Created:', newSite);
};
```

### Pattern 3: Update data
```typescript
const handleUpdate = async () => {
  await fetch(`/api/wedding-sites/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: newTitle })
  });
};
```

### Pattern 4: Delete data
```typescript
const handleDelete = async () => {
  await fetch(`/api/wedding-sites/${id}`, {
    method: 'DELETE'
  });
};
```

---

## 🎯 Key Takeaways

1. **Supabase Auth** = Login/Register/Sessions
   - ใช้ `useAuth()` hook ใน components
   - ใช้ `auth.signIn()`, `auth.signUp()` สำหรับ auth

2. **Prisma** = Database queries
   - ใช้ `prisma.table.findMany()` เพื่อ query
   - ใช้ใน API routes หรือ Server Components

3. **User ID** = เชื่อมระหว่าง Auth และ Database
   - Supabase สร้าง user.id
   - Prisma ใช้ user.id เป็น foreign key

4. **Protected Pages** = ต้องเช็ค auth ก่อน
   - ใช้ `useAuth()` hook
   - Redirect ถ้าไม่มี user

5. **API Routes** = Backend logic
   - Protected: เช็ค auth ก่อน query
   - Public: query ได้เลย

---

## 📚 Next Steps

1. ✅ อ่าน `ARCHITECTURE_FLOW.md` เพื่อเข้าใจ flow โดยละเอียด
2. ✅ ดู `USAGE_EXAMPLES.md` เพื่อดูตัวอย่างโค้ดจริง
3. ✅ ลองสร้าง API route แรก
4. ✅ ลองสร้าง protected page
5. ✅ ทดสอบ authentication flow

---

## 🆘 Need Help?

- `ARCHITECTURE_FLOW.md` - Flow และ architecture โดยละเอียด
- `USAGE_EXAMPLES.md` - ตัวอย่างโค้ดจริง
- `SUPABASE_AUTH.md` - Auth documentation
- `PRISMA_SETUP.md` - Prisma setup guide
- `PRISMA_CONNECTION_GUIDE.md` - แก้ปัญหา connection
