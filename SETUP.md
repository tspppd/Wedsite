# 🚀 WedSite Setup Guide

คู่มือการติดตั้งและตั้งค่าโปรเจค WedSite

## 📋 Prerequisites

- **Bun** v1.0+ (recommended) หรือ Node.js 18+
- **Git**
- **SQLite3** (optional, สำหรับดู database)

## 🔧 Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd wedsite
```

### 2. Install Dependencies

```bash
bun install
# หรือ
npm install
```

### 3. Generate Secret Keys

```bash
bun run generate:secret
```

คำสั่งนี้จะสร้าง secret keys สำหรับ Better Auth:

```
🔐 Better Auth Secret Key Generator
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 Copy these to your .env.local file:

# Better Auth Secret (Required)
BETTER_AUTH_SECRET=<generated-key>

# Optional: JWT Secret
JWT_SECRET=<generated-key>

# Optional: Encryption Key
ENCRYPTION_KEY=<generated-key>
```

### 4. Setup Environment Variables

คัดลอก secret key ที่ได้จากขั้นตอนที่ 3 ไปใส่ใน `.env.local`:

```bash
# .env.local
BETTER_AUTH_SECRET=<your-generated-secret>
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 5. Run Development Server

```bash
bun dev
# หรือ
npm run dev
```

เปิดเบราว์เซอร์ที่ [http://localhost:3000](http://localhost:3000)

### 6. Create Test Users (Optional)

**ต้องเปิด dev server ก่อน!**

Terminal 1:
```bash
bun dev
```

Terminal 2:
```bash
bun run seed
```

คำสั่งนี้จะสร้าง mockup users สำหรับทดสอบ:
- `somchai@test.com` / `Test1234` (Free User)
- `thanapol@test.com` / `Test1234` (Pro User)
- `admin@wedsite.com` / `Admin1234` (Admin)

หรือดูวิธีอื่นๆ ใน [SEED_USERS.md](./SEED_USERS.md)

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | รัน development server |
| `bun build` | Build สำหรับ production |
| `bun start` | รัน production server |
| `bun run seed` | สร้าง mockup users |
| `bun run generate:secret` | สร้าง secret keys |
| `bun lint` | รัน ESLint |

## 🔐 Google OAuth Setup (Optional)

หากต้องการใช้ Google Login:

### 1. สร้าง Google Cloud Project

1. ไปที่ [Google Cloud Console](https://console.cloud.google.com/)
2. สร้าง Project ใหม่
3. เปิดใช้งาน Google+ API

### 2. สร้าง OAuth Credentials

1. ไปที่ **APIs & Services** > **Credentials**
2. คลิก **Create Credentials** > **OAuth client ID**
3. เลือก **Web application**
4. เพิ่ม Authorized redirect URI:
   ```
   http://localhost:3000/api/auth/callback/google
   ```

### 3. อัปเดต Environment Variables

```bash
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here
```

### 4. Restart Server

```bash
bun dev
```

ดูรายละเอียดเพิ่มเติมใน [SETUP_GOOGLE_AUTH.md](./SETUP_GOOGLE_AUTH.md)

## 🧪 Testing

### Test Users Page

เข้าถึงหน้าแสดง mockup users ที่:
```
http://localhost:3000/test-users
```

### Manual Testing

1. **Register**: `/register`
2. **Login**: `/login`
3. **Builder**: `/builder` (requires login)
4. **Payment**: `/payment` (requires login)
5. **Pricing**: `/pricing`

### Test Credentials

```
Free User:
Email: somchai@test.com
Password: Test1234

Pro User:
Email: thanapol@test.com
Password: Test1234

Admin:
Email: admin@wedsite.com
Password: Admin1234
```

## 🗄️ Database

### View Database

```bash
sqlite3 sqlite.db
```

```sql
-- List all tables
.tables

-- View users
SELECT * FROM user;

-- View sessions
SELECT * FROM session;

-- Exit
.quit
```

### Reset Database

```bash
rm sqlite.db sqlite.db-shm sqlite.db-wal
bun dev
```

## 🎨 Features

- ✅ Authentication (Email/Password + Google OAuth)
- ✅ Dark Mode
- ✅ Responsive Design
- ✅ Form Validation (Zod)
- ✅ Session Management
- ✅ Protected Routes
- ✅ Payment Flow
- ✅ Wedding Builder (Basic)

## 📁 Project Structure

```
wedsite/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth pages (login, register)
│   │   ├── (landing)/         # Landing page
│   │   ├── builder/           # Wedding builder
│   │   ├── payment/           # Payment page
│   │   ├── pricing/           # Pricing page
│   │   ├── test-users/        # Test users page
│   │   └── api/               # API routes
│   ├── components/            # React components
│   │   ├── ui/               # UI components
│   │   ├── layouts/          # Layout components
│   │   └── providers/        # Context providers
│   ├── lib/                   # Utilities
│   │   ├── auth.ts           # Better Auth config
│   │   ├── auth-client.ts    # Auth client
│   │   └── validations/      # Zod schemas
│   ├── stores/               # Zustand stores
│   └── types/                # TypeScript types
├── scripts/                   # Utility scripts
│   ├── seed-users.ts         # Seed mockup users
│   └── generate-secret.ts    # Generate secret keys
├── public/                    # Static files
├── .env.local                # Environment variables
└── sqlite.db                 # SQLite database
```

## 🔒 Security

- ✅ Password hashing (bcrypt)
- ✅ Session management
- ✅ CSRF protection
- ✅ Secure cookies
- ✅ Environment variables
- ✅ SQL injection prevention

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Database Locked

```bash
# Remove lock files
rm sqlite.db-shm sqlite.db-wal
```

### Clear Browser Cache

1. เปิด DevTools (F12)
2. Right-click Refresh button
3. เลือก "Empty Cache and Hard Reload"

### Module Not Found

```bash
# Reinstall dependencies
rm -rf node_modules
bun install
```

## 📚 Documentation

- [Better Auth Docs](https://better-auth.com)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Zod Docs](https://zod.dev)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT

## 🆘 Support

หากพบปัญหา:
1. ตรวจสอบ console log
2. ตรวจสอบ network tab
3. ดู error messages
4. ลอง reset database
5. ติดต่อทีมพัฒนา

---

Made with 💕 by WedSite Team
