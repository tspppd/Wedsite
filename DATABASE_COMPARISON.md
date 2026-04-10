# 🗄️ Database Options Comparison

เปรียบเทียบตัวเลือก database ที่มีใน WedSite

## 📊 Overview

โปรเจค WedSite รองรับ 3 แบบ:

| Option | Database | ORM/Client | Best For |
|--------|----------|------------|----------|
| 1️⃣ Better Auth + SQLite | SQLite | Better Auth | Development, Quick Start |
| 2️⃣ Supabase Direct | PostgreSQL | Supabase Client | Realtime, Auth Integration |
| 3️⃣ Prisma + Supabase | PostgreSQL | Prisma ORM | Type-safety, Complex Queries |

---

## 1️⃣ Better Auth + SQLite

### ✅ Pros
- ⚡ ง่ายที่สุด - ไม่ต้องตั้งค่าอะไร
- 🚀 เริ่มใช้งานได้ทันที
- 📦 ไฟล์เดียว (sqlite.db)
- 🔐 Built-in authentication

### ❌ Cons
- 🚫 ไม่เหมาะกับ production
- 🚫 ไม่มี realtime features
- 🚫 Single-threaded
- 🚫 ยากต่อการ scale

### 📝 Setup

```bash
# ไม่ต้องติดตั้งอะไร
bun dev

# Seed users
bun run seed
```

### 💻 Usage

```typescript
// ใช้ Better Auth Client
import { authClient } from '@/lib/auth-client'

const { data: session } = useSession()
```

---

## 2️⃣ Supabase Direct

### ✅ Pros
- ☁️ Cloud-hosted (ไม่ต้องจัดการ server)
- ⚡ Realtime subscriptions
- 🔐 Built-in authentication
- 📊 Dashboard UI
- 🆓 Free tier

### ❌ Cons
- 🌐 ต้องมี internet
- 💰 มีค่าใช้จ่ายเมื่อ scale
- 🔧 ต้องตั้งค่า RLS policies

### 📝 Setup

```bash
# 1. Install packages
bun add @supabase/supabase-js @supabase/ssr

# 2. Set env variables
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...

# 3. Run schema
# Copy supabase/schema.sql to Supabase SQL Editor

# 4. Seed users
bun run seed:supabase
```

### 💻 Usage

```typescript
// Client-side
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
const { data } = await supabase.from('profiles').select()

// Server-side
import { createClient } from '@/lib/supabase/server'

const supabase = await createClient()
```

---

## 3️⃣ Prisma + Supabase (แนะนำ)

### ✅ Pros
- 🎯 Type-safe queries
- 💡 Auto-completion
- 🔧 Easy migrations
- 🎨 Prisma Studio (GUI)
- 📚 Great documentation
- ⚡ Best developer experience

### ❌ Cons
- 📦 เพิ่ม dependencies
- 🔄 ต้อง generate client
- 📝 Learning curve

### 📝 Setup

```bash
# 1. Install Prisma
bun add prisma @prisma/client

# 2. Set DATABASE_URL
DATABASE_URL="postgresql://..."

# 3. Push schema
bun run prisma:push

# 4. Generate client
bun run prisma:generate

# 5. Seed users
bun run seed:prisma
```

### 💻 Usage

```typescript
import prisma from '@/lib/prisma'

// Type-safe queries
const profiles = await prisma.profile.findMany({
  where: { plan: 'PRO' },
  include: { weddingSites: true }
})

// Auto-completion works!
const user = await prisma.profile.create({
  data: {
    name: 'John',
    email: 'john@example.com',
    // TypeScript จะแนะนำ fields ทั้งหมด
  }
})
```

---

## 🎯 Which One Should You Use?

### For Development
```
Better Auth + SQLite
```
- เริ่มได้เลย ไม่ต้องตั้งค่า
- เหมาะสำหรับ prototype

### For Production (Small)
```
Supabase Direct
```
- Free tier เพียงพอ
- ไม่ต้องจัดการ infrastructure
- มี realtime features

### For Production (Recommended)
```
Prisma + Supabase
```
- Type-safety ลด bugs
- Developer experience ดีที่สุด
- Easy to maintain
- Scalable

---

## 🔄 Migration Path

### จาก SQLite → Supabase

1. Export data จาก SQLite
2. Setup Supabase
3. Import data
4. Update connection strings

### จาก Supabase Direct → Prisma

1. Install Prisma
2. Run `bunx prisma db pull` (introspect)
3. Generate client
4. Replace Supabase queries with Prisma

---

## 📊 Feature Comparison

| Feature | SQLite | Supabase | Prisma |
|---------|--------|----------|--------|
| Type Safety | ❌ | ⚠️ Partial | ✅ Full |
| Auto-completion | ❌ | ⚠️ Limited | ✅ Full |
| Realtime | ❌ | ✅ | ❌ |
| GUI | ❌ | ✅ Dashboard | ✅ Studio |
| Migrations | ❌ | ✅ | ✅ |
| Cloud Hosted | ❌ | ✅ | ✅ |
| Free Tier | ✅ | ✅ | ✅ |
| Learning Curve | Easy | Medium | Medium |

---

## 💰 Cost Comparison

### SQLite
- **Free** - ไม่มีค่าใช้จ่าย
- แต่ต้องจ่าย hosting สำหรับ server

### Supabase
- **Free Tier:**
  - 500MB database
  - 2GB bandwidth
  - 50,000 monthly active users
- **Pro:** $25/month
- **Team:** $599/month

### Prisma
- **Free** - ORM ไม่มีค่าใช้จ่าย
- แต่ต้องจ่ายสำหรับ database hosting (Supabase)

---

## 🚀 Performance

### SQLite
- ⚡ Very fast (local file)
- 🚫 Single-threaded
- 📦 Limited to ~1TB

### Supabase (PostgreSQL)
- ⚡ Fast (optimized)
- ✅ Multi-threaded
- 📦 Unlimited size
- 🌐 Network latency

### Prisma
- ⚡ Same as underlying database
- 🎯 Optimized queries
- 📊 Connection pooling

---

## 🎓 Learning Resources

### SQLite + Better Auth
- [Better Auth Docs](https://better-auth.com)
- [SQLite Docs](https://sqlite.org/docs.html)

### Supabase
- [Supabase Docs](https://supabase.com/docs)
- [Supabase YouTube](https://www.youtube.com/@Supabase)

### Prisma
- [Prisma Docs](https://www.prisma.io/docs)
- [Prisma YouTube](https://www.youtube.com/@PrismaData)

---

## 📝 Quick Start Commands

### SQLite (Current)
```bash
bun dev
bun run seed
```

### Supabase
```bash
# Setup in Supabase Dashboard
bun run seed:supabase
```

### Prisma
```bash
bun run prisma:push
bun run prisma:generate
bun run seed:prisma
bun run prisma:studio
```

---

## 🎯 Recommendation

**สำหรับ WedSite โปรเจคนี้:**

```
✅ ใช้ Prisma + Supabase
```

**เหตุผล:**
1. Type-safety ลด bugs
2. Developer experience ดีที่สุด
3. Easy to scale
4. Supabase ให้ free tier
5. Prisma Studio ช่วยในการ debug

---

Made with 💕 by WedSite Team
