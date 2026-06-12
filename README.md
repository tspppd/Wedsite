# Everpage - Wedding Website Builder

แพลตฟอร์มสร้างเว็บไซต์แต่งงานออนไลน์ ด้วย Next.js, Supabase และ Prisma

---

## 🚀 Quick Start

```bash
# Install dependencies
bun install

# Setup environment variables
cp .env.example .env.local
# แก้ไข .env.local ใส่ Supabase credentials

# Push database schema
bunx prisma db push

# Generate Prisma Client
bunx prisma generate

# Run development server
bun dev
```

เปิด [http://localhost:3000](http://localhost:3000)

---

## 📚 Documentation

### 🎯 เริ่มต้นที่นี่
1. **[QUICK_START.md](./QUICK_START.md)** ⭐ เข้าใจใน 5 นาที
2. **[DATABASE_SETUP_GUIDE.md](./DATABASE_SETUP_GUIDE.md)** - Setup database ทีละขั้นตอน
3. **[ARCHITECTURE_FLOW.md](./ARCHITECTURE_FLOW.md)** - ทำความเข้าใจ architecture

### 📖 คู่มือการใช้งาน
4. **[USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md)** - ตัวอย่างโค้ดจริง
5. **[FLOW_DIAGRAMS.md](./FLOW_DIAGRAMS.md)** - Diagrams แสดง flow
6. **[README_ARCHITECTURE.md](./README_ARCHITECTURE.md)** - Architecture overview

### 🔧 Setup & Configuration
7. **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Setup Supabase
8. **[SUPABASE_AUTH.md](./SUPABASE_AUTH.md)** - Authentication guide
9. **[PRISMA_SETUP.md](./PRISMA_SETUP.md)** - Prisma ORM setup
10. **[SETUP_GOOGLE_AUTH.md](./SETUP_GOOGLE_AUTH.md)** - Google OAuth

### 🐛 Troubleshooting
11. **[PRISMA_CONNECTION_GUIDE.md](./PRISMA_CONNECTION_GUIDE.md)** - แก้ปัญหา connection
12. **[DATABASE_COMPARISON.md](./DATABASE_COMPARISON.md)** - Supabase vs SQLite

### ✅ Completion & Migration
13. **[SETUP_COMPLETE.md](./SETUP_COMPLETE.md)** - Setup completion checklist
14. **[MIGRATION_COMPLETE.md](./MIGRATION_COMPLETE.md)** - Better Auth → Supabase

---

## 🏗️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma
- **Authentication:** Supabase Auth
- **State Management:** Zustand
- **Form Validation:** Zod + React Hook Form
- **UI Components:** Custom + shadcn/ui inspired
- **Icons:** Lucide React
- **Theme:** next-themes (Dark/Light mode)

---

## 📁 Project Structure

```
everpage/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (landing)/         # Landing page
│   │   ├── (auth)/            # Login/Register
│   │   ├── builder/           # Wedding site builder
│   │   ├── pricing/           # Pricing page
│   │   ├── payment/           # Payment page
│   │   └── api/               # API routes
│   │
│   ├── components/
│   │   ├── layouts/           # Navbar, Footer
│   │   ├── ui/                # UI components
│   │   └── providers/         # Theme provider
│   │
│   ├── lib/
│   │   ├── auth/              # Auth helpers
│   │   ├── supabase/          # Supabase clients
│   │   ├── prisma.ts          # Prisma client
│   │   └── validations/       # Zod schemas
│   │
│   ├── hooks/
│   │   └── useAuth.ts         # Auth hook
│   │
│   └── stores/                # Zustand stores
│
├── prisma/
│   └── schema.prisma          # Database schema
│
├── supabase/
│   ├── schema.sql             # SQL schema
│   └── rls-policies.sql       # RLS policies
│
└── public/                    # Static files
```

---

## 🗄️ Database Schema

### Tables
- `profiles` - User profiles
- `wedding_sites` - Wedding websites
- `rsvp_responses` - RSVP submissions
- `payments` - Payment records
- `analytics` - Analytics data
- `session` - User sessions

### Relations
```
profiles (1) → (N) wedding_sites
wedding_sites (1) → (N) rsvp_responses
wedding_sites (1) → (N) analytics
profiles (1) → (N) payments
profiles (1) → (N) session
```

---

## 🔐 Authentication Flow

1. User registers at `/register`
2. Supabase Auth creates user
3. Database trigger creates profile
4. User logs in at `/login`
5. Session stored in cookies
6. Access protected pages

---

## 🎨 Features

### ✅ Implemented
- [x] Dark/Light theme toggle
- [x] User authentication (Email/Password)
- [x] Google OAuth login
- [x] Protected routes
- [x] Database integration (Prisma + Supabase)
- [x] Form validation (Zod)
- [x] Responsive design
- [x] Landing page
- [x] Pricing page
- [x] Builder page (skeleton)
- [x] Payment page (skeleton)

### 🚧 In Progress
- [ ] Wedding site builder (full features)
- [ ] RSVP form
- [ ] Template selection
- [ ] Custom domain setup
- [ ] Payment integration
- [ ] Analytics dashboard

### 📋 Planned
- [ ] Email notifications
- [ ] Guest management
- [ ] Photo gallery
- [ ] Live streaming integration
- [ ] Gift registry
- [ ] Seating chart

---

## 🚀 Development

### Prerequisites
- Bun >= 1.0
- Node.js >= 18
- PostgreSQL (via Supabase)

### Environment Variables
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key

# Database
DATABASE_URL=your_database_url
DIRECT_URL=your_direct_url

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Commands
```bash
# Development
bun dev                    # Start dev server
bun build                  # Build for production
bun start                  # Start production server

# Database
bunx prisma db push        # Push schema to database
bunx prisma generate       # Generate Prisma Client
bunx prisma studio         # Open Prisma Studio
bunx prisma db pull        # Pull schema from database

# Linting
bun lint                   # Run ESLint
```

---

## 📝 API Routes

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /auth/callback` - OAuth callback

### Profile
- `GET /api/profile` - Get user profile
- `PATCH /api/profile` - Update profile

### Wedding Sites
- `GET /api/wedding-sites` - Get all sites
- `POST /api/wedding-sites` - Create site
- `GET /api/wedding-sites/[id]` - Get site
- `PATCH /api/wedding-sites/[id]` - Update site
- `DELETE /api/wedding-sites/[id]` - Delete site

### RSVP
- `POST /api/rsvp` - Submit RSVP
- `GET /api/rsvp/[siteId]` - Get RSVPs

---

## 🔒 Security

- Row Level Security (RLS) enabled
- Authentication required for protected routes
- CSRF protection
- SQL injection prevention (Prisma)
- XSS protection (Next.js)
- Secure password hashing (Supabase)

---

## 📄 License

MIT License - see LICENSE file for details

---

## 🤝 Contributing

Contributions are welcome! Please read CONTRIBUTING.md first.

---

## 📞 Support

- Documentation: See docs folder
- Issues: GitHub Issues
- Email: support@everpage.com

---

**Made with ❤️ for couples around the world**
