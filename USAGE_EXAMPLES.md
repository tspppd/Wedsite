# 💡 Usage Examples: Supabase + Prisma

## 🎯 สถานการณ์จริงในการใช้งาน

---

## Example 1: สร้างหน้า Profile

### Step 1: สร้าง API Route เพื่อดึงข้อมูล Profile

```typescript
// src/app/api/profile/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  // 1. ตรวจสอบ authentication ด้วย Supabase
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // 2. ดึงข้อมูล profile จาก database ด้วย Prisma
  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    include: {
      weddingSites: {
        orderBy: { createdAt: 'desc' },
        take: 5
      }
    }
  });
  
  // 3. ถ้าไม่มี profile ให้สร้างใหม่
  if (!profile) {
    const newProfile = await prisma.profile.create({
      data: {
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.name || user.email!.split('@')[0],
        plan: 'free'
      }
    });
    return NextResponse.json(newProfile);
  }
  
  return NextResponse.json(profile);
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const body = await request.json();
  
  // อัปเดต profile
  const updatedProfile = await prisma.profile.update({
    where: { id: user.id },
    data: {
      name: body.name,
      avatarUrl: body.avatarUrl
    }
  });
  
  return NextResponse.json(updatedProfile);
}
```

### Step 2: สร้าง Profile Page

```typescript
// src/app/profile/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface Profile {
  id: string;
  email: string;
  name: string;
  plan: string;
  avatarUrl?: string;
  weddingSites: any[];
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  // Fetch profile
  useEffect(() => {
    if (user) {
      fetch('/api/profile')
        .then(res => res.json())
        .then(data => {
          setProfile(data);
          setName(data.name);
        });
    }
  }, [user]);
  
  const handleUpdate = async () => {
    const response = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    
    const updated = await response.json();
    setProfile(updated);
    setIsEditing(false);
  };
  
  if (loading || !profile) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4">
        <div>
          <label className="text-sm text-gray-500">Email</label>
          <p className="text-lg">{profile.email}</p>
        </div>
        
        <div>
          <label className="text-sm text-gray-500">Name</label>
          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          ) : (
            <p className="text-lg">{profile.name}</p>
          )}
        </div>
        
        <div>
          <label className="text-sm text-gray-500">Plan</label>
          <p className="text-lg capitalize">{profile.plan}</p>
        </div>
        
        <div>
          <label className="text-sm text-gray-500">Wedding Sites</label>
          <p className="text-lg">{profile.weddingSites.length} sites</p>
        </div>
        
        {isEditing ? (
          <div className="flex gap-2">
            <button onClick={handleUpdate} className="px-4 py-2 bg-pink-500 text-white rounded">
              Save
            </button>
            <button onClick={() => setIsEditing(false)} className="px-4 py-2 border rounded">
              Cancel
            </button>
          </div>
        ) : (
          <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-pink-500 text-white rounded">
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}
```

---

## Example 2: สร้าง Wedding Site

### Step 1: API Route สำหรับ Wedding Sites

```typescript
// src/app/api/wedding-sites/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const weddingSites = await prisma.weddingSite.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { rsvpResponses: true }
      }
    }
  });
  
  return NextResponse.json(weddingSites);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const body = await request.json();
  
  // ตรวจสอบว่า user เป็น Pro หรือไม่
  const profile = await prisma.profile.findUnique({
    where: { id: user.id }
  });
  
  if (profile?.plan === 'free') {
    // Free plan จำกัด 1 site
    const existingSites = await prisma.weddingSite.count({
      where: { userId: user.id }
    });
    
    if (existingSites >= 1) {
      return NextResponse.json(
        { error: 'Free plan limited to 1 wedding site. Upgrade to Pro for unlimited sites.' },
        { status: 403 }
      );
    }
  }
  
  const weddingSite = await prisma.weddingSite.create({
    data: {
      userId: user.id,
      title: body.title,
      groomName: body.groomName,
      brideName: body.brideName,
      weddingDate: new Date(body.weddingDate),
      theme: body.theme || 'romantic',
      customDomain: body.customDomain,
      isPublished: false
    }
  });
  
  return NextResponse.json(weddingSite);
}
```

### Step 2: Wedding Sites List Page

```typescript
// src/app/wedding-sites/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Eye, Edit, Trash } from 'lucide-react';

interface WeddingSite {
  id: string;
  title: string;
  groomName: string;
  brideName: string;
  weddingDate: string;
  theme: string;
  isPublished: boolean;
  _count: {
    rsvpResponses: number;
  };
}

export default function WeddingSitesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [sites, setSites] = useState<WeddingSite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  useEffect(() => {
    if (user) {
      fetch('/api/wedding-sites')
        .then(res => res.json())
        .then(data => {
          setSites(data);
          setIsLoading(false);
        });
    }
  }, [user]);
  
  if (loading || isLoading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Wedding Sites</h1>
        <Link href="/wedding-sites/new">
          <button className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded">
            <Plus className="w-5 h-5" />
            Create New Site
          </button>
        </Link>
      </div>
      
      {sites.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">You haven't created any wedding sites yet.</p>
          <Link href="/wedding-sites/new">
            <button className="px-6 py-3 bg-pink-500 text-white rounded">
              Create Your First Site
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sites.map(site => (
            <div key={site.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <h3 className="text-xl font-semibold mb-2">{site.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-1">
                {site.groomName} & {site.brideName}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                {new Date(site.weddingDate).toLocaleDateString()}
              </p>
              
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-2 py-1 text-xs rounded ${
                  site.isPublished 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {site.isPublished ? 'Published' : 'Draft'}
                </span>
                <span className="text-sm text-gray-500">
                  {site._count.rsvpResponses} RSVPs
                </span>
              </div>
              
              <div className="flex gap-2">
                <Link href={`/wedding-sites/${site.id}`} className="flex-1">
                  <button className="w-full flex items-center justify-center gap-2 px-3 py-2 border rounded">
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                </Link>
                <Link href={`/wedding-sites/${site.id}/edit`}>
                  <button className="px-3 py-2 border rounded">
                    <Edit className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## Example 3: RSVP Form (Public Page)

### Step 1: API Route สำหรับ RSVP

```typescript
// src/app/api/rsvp/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const body = await request.json();
  
  // ไม่ต้อง authenticate เพราะเป็น public form
  
  const rsvp = await prisma.rsvpResponse.create({
    data: {
      weddingSiteId: body.weddingSiteId,
      guestName: body.guestName,
      email: body.email,
      phone: body.phone,
      attending: body.attending,
      numberOfGuests: body.numberOfGuests,
      dietaryRestrictions: body.dietaryRestrictions,
      message: body.message
    }
  });
  
  // ส่ง email confirmation (optional)
  // await sendRSVPConfirmation(rsvp);
  
  return NextResponse.json(rsvp);
}
```

### Step 2: Public RSVP Page

```typescript
// src/app/w/[slug]/rsvp/page.tsx
'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';

export default function RSVPPage() {
  const params = useParams();
  const [formData, setFormData] = useState({
    guestName: '',
    email: '',
    phone: '',
    attending: true,
    numberOfGuests: 1,
    dietaryRestrictions: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const response = await fetch('/api/rsvp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        weddingSiteId: params.slug
      })
    });
    
    if (response.ok) {
      setSubmitted(true);
    }
  };
  
  if (submitted) {
    return (
      <div className="max-w-md mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
        <p>Your RSVP has been received.</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">RSVP</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Name</label>
          <input
            type="text"
            value={formData.guestName}
            onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block mb-2">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block mb-2">Will you attend?</label>
          <select
            value={formData.attending ? 'yes' : 'no'}
            onChange={(e) => setFormData({ ...formData, attending: e.target.value === 'yes' })}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="yes">Yes, I'll be there!</option>
            <option value="no">Sorry, can't make it</option>
          </select>
        </div>
        
        {formData.attending && (
          <div>
            <label className="block mb-2">Number of Guests</label>
            <input
              type="number"
              min="1"
              value={formData.numberOfGuests}
              onChange={(e) => setFormData({ ...formData, numberOfGuests: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        )}
        
        <div>
          <label className="block mb-2">Message (Optional)</label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        
        <button type="submit" className="w-full py-3 bg-pink-500 text-white rounded">
          Submit RSVP
        </button>
      </form>
    </div>
  );
}
```

---

## 🎯 สรุป Pattern การใช้งาน

### 1. Protected API Routes (ต้อง login)
```typescript
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
if (!user) return error;

// ใช้ Prisma query ด้วย user.id
const data = await prisma.table.findMany({
  where: { userId: user.id }
});
```

### 2. Public API Routes (ไม่ต้อง login)
```typescript
// ไม่ต้องเช็ค auth
const data = await prisma.table.create({
  data: body
});
```

### 3. Protected Pages (ต้อง login)
```typescript
const { user, loading } = useAuth();

useEffect(() => {
  if (!loading && !user) {
    router.push('/login');
  }
}, [user, loading]);
```

### 4. Fetch Data in Client Component
```typescript
useEffect(() => {
  if (user) {
    fetch('/api/endpoint')
      .then(res => res.json())
      .then(setData);
  }
}, [user]);
```

---

ตัวอย่างเหล่านี้แสดงให้เห็น flow การทำงานจริงของ Supabase Auth + Prisma ในแอปพลิเคชัน Next.js
