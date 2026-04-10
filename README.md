# WedSite - Wedding Website Builder

สร้างเว็บไซต์งานแต่งงานของคุณได้ง่ายๆ ไม่ต้องเขียนโค้ด

## Features

- 🎨 Drag & Drop Builder
- 💒 Beautiful Templates
- 🌙 Dark Mode Support
- 🔐 Authentication with Better Auth
- 📱 Responsive Design
- ⚡ Built with Next.js 16 & React 19

## Getting Started

### Prerequisites

- Bun (recommended) or Node.js 18+

### Installation

```bash
# Install dependencies
bun install

# Set up environment variables
cp .env.local.example .env.local

# Generate auth secret
# Update BETTER_AUTH_SECRET in .env.local

# Run development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Tech Stack

- **Framework**: Next.js 16.2
- **UI**: React 19, Tailwind CSS 4
- **Authentication**: Better Auth
- **Database**: SQLite (via better-sqlite3)
- **State Management**: Zustand
- **Icons**: Lucide React
- **Theme**: next-themes

## Project Structure

```
src/
├── app/              # Next.js app directory
├── components/       # React components
│   ├── ui/          # UI components
│   ├── layouts/     # Layout components
│   └── providers/   # Context providers
├── lib/             # Utilities and configs
├── stores/          # Zustand stores
└── types/           # TypeScript types
```

## Authentication

This project uses Better Auth for authentication:

- Email/Password authentication
- Session management
- Protected routes
- User profile management

## Environment Variables

```env
BETTER_AUTH_SECRET=your-secret-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## License

MIT
