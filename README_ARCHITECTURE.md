# 📖 WedSite Architecture Documentation

## 📚 เอกสารทั้งหมด

### 🚀 เริ่มต้นที่นี่
1. **[QUICK_START.md](./QUICK_START.md)** - เข้าใจใน 5 นาที ⭐ เริ่มที่นี่
2. **[ARCHITECTURE_FLOW.md](./ARCHITECTURE_FLOW.md)** - Flow และ architecture โดยละเอียด
3. **[USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md)** - ตัวอย่างโค้ดจริงๆ

### 🔧 Setup & Configuration
4. **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Setup Supabase database
5. **[SUPABASE_AUTH.md](./SUPABASE_AUTH.md)** - Supabase authentication guide
6. **[PRISMA_SETUP.md](./PRISMA_SETUP.md)** - Prisma ORM setup
7. **[SETUP_GOOGLE_AUTH.md](./SETUP_GOOGLE_AUTH.md)** - Google OAuth setup

### 🐛 Troubleshooting
8. **[PRISMA_CONNECTION_GUIDE.md](./PRISMA_CONNECTION_GUIDE.md)** - แก้ปัญหา connection
9. **[DATABASE_COMPARISON.md](./DATABASE_COMPARISON.md)** - Supabase vs SQLite

### 📝 Migration & History
10. **[MIGRATION_COMPLETE.md](./MIGRATION_COMPLETE.md)** - Better Auth → Supabase migration

---

## 🏗️ System Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js)                      │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Pages:                    Components:                          │
│  ├─ / (Landing)           ├─ Navbar                            │
│  ├─ /login                ├─ Footer                            │
│  ├─ /register             ├─ ThemeToggle                       │
│  ├─ /builder              └─ UI Components                     │
│  ├─ /pricing                                                    │
│  └─ /payment              Hooks:                               │
│                           └─ useAuth()                          │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP Requests
                              ▼
┌────────────────────────────────────────────────────────────────┐
│                      API Routes (Next.js)                       │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  /api/profile              - Get/Update user profile           │
│  /api/wedding-sites        - CRUD wedding sites                │
│  /api/rsvp                 - Handle RSVP submissions           │
│  /api/payments             - Process payments                  │
│  /auth/callback            - OAuth callback                    │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
           │                                    │
           │                                    │
           ▼                                    ▼
┌──────────────────────┐           ┌──────────────────────┐
│   Supabase Auth      │           │   Prisma ORM         │
│   (Authentication)   │           │   (Database)         │
├──────────────────────┤           ├──────────────────────┤
│                      │           │                      │
│ ✅ Sign Up           │           │ ✅ CRUD Operations   │
│ ✅ Sign In           │           │ ✅ Type-safe queries │
│ ✅ Sign Out          │           │ ✅ Relations         │
│ ✅ Google OAuth      │           │ ✅ Migrations        │
│ ✅ Session Mgmt      │           │                      │
│                      │           │                      │
└──────────────────────┘           └──────────────────────┘
           │                                    │
           │                                    │
           └────────────────┬───────────────────┘
                            │
                            ▼
           ┌────────────────────────────────────┐
           │   PostgreSQL Database              │
           │   (Hosted by Supabase)             │
           ├────────────────────────────────────┤
           │                                    │
           │  Tables:                           │
           │  ├─ auth.users (Supabase)         │
           │  ├─ public.profiles               │
           │  ├─ public.wedding_sites          │
           │  ├─ public.rsvp_responses         │
           │  ├─ public.payments               │
           │  └─ public.analytics              │
           │                                    │
           └────────────────────────────────────┘
```

---

## 🔑 Key Concepts

### 1. Separation of Concerns

**Supabase Auth** จัดการ:
- User authentication (login/register)
- Session management
- OAuth providers (Google)
- Password reset
- Email verification

**Prisma ORM** จัดการ:
- Database queries
- Data relationships
- Type safety
- Schema migrations
- Complex queries

### 2. Data Flow

```
User Action → Frontend → API Route → Auth Check → Database Query → Response
```

**ตัวอย่าง: สร้าง Wedding Site**
```
1. User คลิก "Create Site" ที่หน้า /builder
2. Frontend ส่ง POST request ไป /api/wedding-sites
3. API Route เช็ค authentication ด้วย Supabase
4. ถ้า authenticated, ใช้ Prisma สร้างข้อมูลใน database
5. Response กลับไปที่ Frontend
6. Frontend แสดงผลลัพธ์
```

### 3. Authentication Flow

```
Register:
User → RegisterPage → auth.signUp() → Supabase Auth → Create user
                                                    → Create profile (Prisma)

Login:
User → LoginPage → auth.signIn() → Supabase Auth → Create session
                                                  → Store in cookies

Protected Page:
User → Page → useAuth() → Check session → Allow/Deny access
```

---

## 📁 Project Structure

```
wedsite/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (landing)/               # Landing page
│   │   ├── (auth)/                  # Auth pages (login/register)
│   │   ├── builder/                 # Wedding site builder
│   │   ├── pricing/                 # Pricing page
│   │   ├── payment/                 # Payment page
│   │   ├── api/                     # API routes
│   │   │   ├── profile/
│   │   │   ├── wedding-sites/
│   │   │   └── rsvp/
│   │   └── auth/
│   │       └── callback/            # OAuth callback
│   │
│   ├── components/
│   │   ├── layouts/                 # Navbar, Footer
│   │   ├── ui/                      # UI components
│   │   └── providers/               # Theme provider
│   │
│   ├── lib/
│   │   ├── auth/
│   │   │   └── client.ts            # ⭐ Auth helpers
│   │   ├── supabase/
│   │   │   ├── client.ts            # Browser client
│   │   │   ├── server.ts            # Server client
│   │   │   └── middleware.ts        # Middleware client
│   │   ├── prisma.ts                # ⭐ Prisma client
│   │   ├── utils.ts                 # Utilities
│   │   └── validations/
│   │       └── auth.ts              # Zod schemas
│   │
│   ├── hooks/
│   │   └── useAuth.ts               # ⭐ Auth hook
│   │
│   ├── stores/                      # Zustand stores
│   │   ├── useAuthStore.ts
│   │   └── useWeddingStore.ts
│   │
│   └── types/
│       └── index.ts                 # TypeScript types
│
├── prisma/
│   └── schema.prisma                # ⭐ Database schema
│
├── supabase/
│   └── schema.sql                   # SQL schema
│
├── public/                          # Static files
│
├── .env.local                       # ⭐ Environment variables
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## 🔐 Security

### Row Level Security (RLS)

```sql
-- Users can only see their own data
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Users can only update their own data
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Users can only see their own wedding sites
CREATE POLICY "Users can view own wedding sites"
ON wedding_sites FOR SELECT
USING (auth.uid() = user_id);
```

### API Route Protection

```typescript
// Always check authentication in protected routes
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();

if (!user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

---

## 🎯 Best Practices

### 1. Always use useAuth() in client components
```typescript
const { user, loading } = useAuth();
```

### 2. Check authentication in API routes
```typescript
const { data: { user } } = await supabase.auth.getUser();
if (!user) return error;
```

### 3. Use Prisma for type-safe queries
```typescript
const profile = await prisma.profile.findUnique({
  where: { id: userId }
});
```

### 4. Handle loading states
```typescript
if (loading) return <LoadingSpinner />;
if (!user) return <LoginPrompt />;
```

### 5. Use environment variables
```typescript
// Never hardcode credentials
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
```

---

## 🚀 Development Workflow

### 1. Start Development Server
```bash
bun dev
```

### 2. Make Schema Changes
```bash
# Edit prisma/schema.prisma
# Then push to database
bunx prisma db push

# Or use SQL Editor in Supabase Dashboard
```

### 3. Generate Prisma Client
```bash
bunx prisma generate
```

### 4. View Database
```bash
bunx prisma studio
```

### 5. Test Authentication
- Go to `/register` and create account
- Login at `/login`
- Access protected pages like `/builder`

---

## 📊 Database Schema

### Core Tables

**profiles** - User profiles
```typescript
{
  id: string (UUID)
  email: string
  name: string
  plan: 'free' | 'pro'
  avatarUrl?: string
  createdAt: DateTime
}
```

**wedding_sites** - Wedding websites
```typescript
{
  id: string (UUID)
  userId: string (FK → profiles.id)
  title: string
  groomName: string
  brideName: string
  weddingDate: DateTime
  theme: string
  customDomain?: string
  isPublished: boolean
  createdAt: DateTime
}
```

**rsvp_responses** - RSVP submissions
```typescript
{
  id: string (UUID)
  weddingSiteId: string (FK → wedding_sites.id)
  guestName: string
  email: string
  attending: boolean
  numberOfGuests: number
  message?: string
  createdAt: DateTime
}
```

---

## 🎓 Learning Path

### Beginner
1. ✅ Read `QUICK_START.md`
2. ✅ Understand authentication flow
3. ✅ Create a simple protected page
4. ✅ Make your first API route

### Intermediate
1. ✅ Read `ARCHITECTURE_FLOW.md`
2. ✅ Understand Prisma relations
3. ✅ Implement CRUD operations
4. ✅ Add form validation with Zod

### Advanced
1. ✅ Read `USAGE_EXAMPLES.md`
2. ✅ Implement complex queries
3. ✅ Add real-time features
4. ✅ Optimize performance

---

## 🆘 Common Issues

### Can't connect to database?
→ See `PRISMA_CONNECTION_GUIDE.md`

### Authentication not working?
→ See `SUPABASE_AUTH.md`

### Need to migrate from Better Auth?
→ See `MIGRATION_COMPLETE.md`

### Want to compare databases?
→ See `DATABASE_COMPARISON.md`

---

## 📞 Support

- 📖 Documentation: See files listed above
- 🐛 Issues: Check troubleshooting guides
- 💡 Examples: See `USAGE_EXAMPLES.md`

---

**Happy Coding! 🎉**
