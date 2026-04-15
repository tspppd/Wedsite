# 📊 Flow Diagrams

## 1. 🔐 Authentication Flow

### Register Flow
```
┌─────────────┐
│    User     │
│ กรอกฟอร์ม   │
└──────┬──────┘
       │
       │ email, password, name
       ▼
┌─────────────────────────┐
│   RegisterPage.tsx      │
│                         │
│ const { data, error } = │
│ await auth.signUp(...)  │
└──────────┬──────────────┘
           │
           │ HTTP Request
           ▼
┌─────────────────────────────────┐
│  src/lib/auth/client.ts         │
│                                 │
│  supabase.auth.signUp({        │
│    email,                       │
│    password,                    │
│    options: {                   │
│      data: { name }             │
│    }                            │
│  })                             │
└──────────┬──────────────────────┘
           │
           │ API Call
           ▼
┌─────────────────────────────────┐
│    Supabase Auth Service        │
│    (Cloud)                      │
│                                 │
│  1. Hash password               │
│  2. Create user in auth.users   │
│  3. Store metadata (name)       │
│  4. Send verification email     │
└──────────┬──────────────────────┘
           │
           │ Database Trigger
           ▼
┌─────────────────────────────────┐
│    PostgreSQL Database          │
│                                 │
│  INSERT INTO public.profiles    │
│  (id, email, name, plan)        │
│  VALUES (user.id, ...)          │
└──────────┬──────────────────────┘
           │
           │ Response
           ▼
┌─────────────────────────────────┐
│    Frontend                     │
│                                 │
│  ✅ Show success message        │
│  ✅ Redirect to /login          │
└─────────────────────────────────┘
```

### Login Flow
```
┌─────────────┐
│    User     │
│ กรอก email  │
│ & password  │
└──────┬──────┘
       │
       ▼
┌─────────────────────────┐
│   LoginPage.tsx         │
│                         │
│ auth.signIn(            │
│   email,                │
│   password              │
│ )                       │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────────────┐
│  Supabase Auth Service          │
│                                 │
│  1. Verify email/password       │
│  2. Create session token        │
│  3. Set cookies                 │
└──────────┬──────────────────────┘
           │
           │ Session Created
           ▼
┌─────────────────────────────────┐
│    useAuth Hook                 │
│                                 │
│  user state: null → User object │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│    Redirect to /builder         │
└─────────────────────────────────┘
```

---

## 2. 🔒 Protected Page Access

```
┌─────────────┐
│    User     │
│ เข้า /builder│
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│   BuilderPage.tsx               │
│                                 │
│   const { user, loading } =     │
│     useAuth()                   │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│   useAuth Hook                  │
│                                 │
│   1. auth.getSession()          │
│   2. Check cookies              │
│   3. Return user state          │
└──────────┬──────────────────────┘
           │
           ├─────────────┬─────────────┐
           │             │             │
           ▼             ▼             ▼
    ┌──────────┐  ┌──────────┐  ┌──────────┐
    │ loading  │  │ no user  │  │ has user │
    │ = true   │  │          │  │          │
    └────┬─────┘  └────┬─────┘  └────┬─────┘
         │             │             │
         ▼             ▼             ▼
    ┌──────────┐  ┌──────────┐  ┌──────────┐
    │  Show    │  │ Redirect │  │  Show    │
    │ Spinner  │  │ to login │  │ Content  │
    └──────────┘  └──────────┘  └──────────┘
```

---

## 3. 📊 Database Query Flow

### Read Data (GET)
```
┌─────────────┐
│  Frontend   │
│  Component  │
└──────┬──────┘
       │
       │ fetch('/api/wedding-sites')
       ▼
┌─────────────────────────────────┐
│  API Route                      │
│  /api/wedding-sites/route.ts   │
│                                 │
│  export async function GET() {  │
└──────────┬──────────────────────┘
           │
           │ 1. Check Auth
           ▼
┌─────────────────────────────────┐
│  Supabase Auth                  │
│                                 │
│  const { user } =               │
│    await supabase.auth          │
│      .getUser()                 │
└──────────┬──────────────────────┘
           │
           ├─────────────┬
           │             │
           ▼             ▼
    ┌──────────┐  ┌──────────────┐
    │ No user  │  │  Has user    │
    │ Return   │  │  Continue    │
    │ 401      │  │              │
    └──────────┘  └──────┬───────┘
                         │
                         │ 2. Query Database
                         ▼
                  ┌──────────────────────┐
                  │  Prisma Client       │
                  │                      │
                  │  const sites =       │
                  │  await prisma        │
                  │    .weddingSite      │
                  │    .findMany({       │
                  │      where: {        │
                  │        userId        │
                  │      }               │
                  │    })                │
                  └──────┬───────────────┘
                         │
                         │ SQL Query
                         ▼
                  ┌──────────────────────┐
                  │  PostgreSQL          │
                  │                      │
                  │  SELECT * FROM       │
                  │  wedding_sites       │
                  │  WHERE user_id = ... │
                  └──────┬───────────────┘
                         │
                         │ Results
                         ▼
                  ┌──────────────────────┐
                  │  Prisma Client       │
                  │                      │
                  │  Convert to          │
                  │  TypeScript objects  │
                  └──────┬───────────────┘
                         │
                         │ Return JSON
                         ▼
                  ┌──────────────────────┐
                  │  Frontend            │
                  │                      │
                  │  setData(sites)      │
                  │  Render UI           │
                  └──────────────────────┘
```

### Create Data (POST)
```
┌─────────────┐
│  Frontend   │
│  Form       │
└──────┬──────┘
       │
       │ fetch('/api/wedding-sites', {
       │   method: 'POST',
       │   body: JSON.stringify(data)
       │ })
       ▼
┌─────────────────────────────────┐
│  API Route                      │
│                                 │
│  1. Check authentication        │
│  2. Validate data               │
│  3. Check plan limits           │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│  Prisma Client                  │
│                                 │
│  const site =                   │
│  await prisma.weddingSite       │
│    .create({                    │
│      data: {                    │
│        userId: user.id,         │
│        title: body.title,       │
│        ...                      │
│      }                          │
│    })                           │
└──────────┬──────────────────────┘
           │
           │ INSERT INTO wedding_sites
           ▼
┌─────────────────────────────────┐
│  PostgreSQL                     │
│                                 │
│  INSERT INTO wedding_sites      │
│  (id, user_id, title, ...)      │
│  VALUES (...)                   │
│  RETURNING *                    │
└──────────┬──────────────────────┘
           │
           │ New record
           ▼
┌─────────────────────────────────┐
│  Frontend                       │
│                                 │
│  ✅ Show success message        │
│  ✅ Update UI                   │
│  ✅ Redirect to new site        │
└─────────────────────────────────┘
```

---

## 4. 🔄 Complete User Journey

### Journey: สร้าง Wedding Site
```
START
  │
  ▼
┌─────────────────┐
│ User ไม่มี      │
│ account         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ ไปหน้า Register │
│ สมัครสมาชิก     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Supabase Auth   │
│ สร้าง user      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Prisma สร้าง    │
│ profile         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Redirect to     │
│ /login          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ User login      │
│ ด้วย email/pwd  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Session created │
│ Cookies set     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Redirect to     │
│ /builder        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ useAuth() check │
│ ✅ Authenticated│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ แสดงหน้า Builder│
│ + Form สร้าง    │
│ wedding site    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ User กรอกฟอร์ม  │
│ - Title         │
│ - Names         │
│ - Date          │
│ - Theme         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Submit form     │
│ POST /api/      │
│ wedding-sites   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ API Route       │
│ 1. Check auth   │
│ 2. Check plan   │
│ 3. Validate     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Prisma create   │
│ wedding_site    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ PostgreSQL      │
│ INSERT record   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Response        │
│ { id, title,... }│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Frontend        │
│ ✅ Success!     │
│ Redirect to     │
│ /builder/{id}   │
└────────┬────────┘
         │
         ▼
       END
```

---

## 5. 🎨 Component Hierarchy

```
App
├── ThemeProvider
│   └── Layout
│       ├── Navbar
│       │   ├── ThemeToggle
│       │   └── useAuth() ← Check login status
│       │
│       ├── Page Content
│       │   │
│       │   ├── Public Pages
│       │   │   ├── Landing Page
│       │   │   ├── Pricing Page
│       │   │   └── Login/Register
│       │   │
│       │   └── Protected Pages
│       │       ├── useAuth() ← Redirect if not logged in
│       │       ├── Builder Page
│       │       ├── Payment Page
│       │       └── Profile Page
│       │
│       └── Footer
│
└── API Routes
    ├── /api/profile
    │   └── Check auth → Prisma query
    │
    ├── /api/wedding-sites
    │   └── Check auth → Prisma query
    │
    └── /api/rsvp
        └── Public → Prisma query
```

---

## 6. 🗄️ Database Relationships

```
┌─────────────────────┐
│   auth.users        │ (Managed by Supabase)
│   (Supabase Auth)   │
├─────────────────────┤
│ id (UUID)           │
│ email               │
│ encrypted_password  │
│ user_metadata       │
└──────────┬──────────┘
           │
           │ 1:1
           │
           ▼
┌─────────────────────┐
│   public.profiles   │
├─────────────────────┤
│ id (UUID) ←─────────┼─ Same as auth.users.id
│ email               │
│ name                │
│ plan                │
│ avatar_url          │
└──────────┬──────────┘
           │
           │ 1:N
           │
           ▼
┌─────────────────────┐
│ public.wedding_sites│
├─────────────────────┤
│ id (UUID)           │
│ user_id (FK) ───────┼─ References profiles.id
│ title               │
│ groom_name          │
│ bride_name          │
│ wedding_date        │
│ theme               │
│ custom_domain       │
│ is_published        │
└──────────┬──────────┘
           │
           │ 1:N
           │
           ▼
┌─────────────────────┐
│ public.rsvp_        │
│ responses           │
├─────────────────────┤
│ id (UUID)           │
│ wedding_site_id ────┼─ References wedding_sites.id
│ guest_name          │
│ email               │
│ attending           │
│ number_of_guests    │
│ message             │
└─────────────────────┘
```

---

## 7. 🔐 Security Layers

```
┌─────────────────────────────────────────────┐
│           Layer 1: Frontend                 │
│                                             │
│  ✅ useAuth() hook checks login status      │
│  ✅ Redirect to /login if not authenticated │
│  ✅ Hide sensitive UI elements              │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│           Layer 2: API Routes               │
│                                             │
│  ✅ Check Supabase session                  │
│  ✅ Verify user.id                          │
│  ✅ Return 401 if unauthorized              │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│           Layer 3: Database (RLS)           │
│                                             │
│  ✅ Row Level Security policies             │
│  ✅ Users can only see their own data       │
│  ✅ Enforced at database level              │
└─────────────────────────────────────────────┘
```

---

## 📝 Summary

- **Supabase Auth** = User authentication & sessions
- **Prisma** = Type-safe database queries
- **PostgreSQL** = Actual data storage
- **RLS** = Database-level security
- **useAuth()** = React hook for auth state
- **API Routes** = Backend logic & validation

**Key Point:** Supabase และ Prisma ทำงานร่วมกัน ไม่ได้แยกกัน!
- Supabase สร้าง user.id
- Prisma ใช้ user.id เป็น foreign key
- ทั้งสองเชื่อมต่อกับ PostgreSQL database เดียวกัน
