'use client'

import { useState } from 'react';
import Link from 'next/link';
import { Heart, Copy, CheckCircle, User, Crown, Shield } from 'lucide-react';
import { Button, Card, CardContent } from '@/components/ui';

interface MockUser {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  plan: 'free' | 'pro';
  description: string;
  icon: typeof User;
  color: string;
}

export default function TestUsersPage() {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const mockUsers: MockUser[] = [
    {
      name: 'สมชาย ใจดี',
      email: 'somchai@test.com',
      password: 'Test1234',
      role: 'user',
      plan: 'free',
      description: 'User ทั่วไป - Free Plan',
      icon: User,
      color: 'blue',
    },
    {
      name: 'สมหญิง รักดี',
      email: 'somying@test.com',
      password: 'Test1234',
      role: 'user',
      plan: 'free',
      description: 'User ทั่วไป - Free Plan',
      icon: User,
      color: 'blue',
    },
    {
      name: 'ธนพล มั่งมี',
      email: 'thanapol@test.com',
      password: 'Test1234',
      role: 'user',
      plan: 'pro',
      description: 'Pro User - Premium Features',
      icon: Crown,
      color: 'purple',
    },
    {
      name: 'Admin WedSite',
      email: 'admin@wedsite.com',
      password: 'Admin1234',
      role: 'admin',
      plan: 'pro',
      description: 'Administrator - Full Access',
      icon: Shield,
      color: 'pink',
    },
  ];

  const copyToClipboard = (text: string, email: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-600 dark:text-blue-400',
        border: 'border-blue-200 dark:border-blue-800',
      },
      purple: {
        bg: 'bg-purple-100 dark:bg-purple-900/30',
        text: 'text-purple-600 dark:text-purple-400',
        border: 'border-purple-200 dark:border-purple-800',
      },
      pink: {
        bg: 'bg-pink-100 dark:bg-pink-900/30',
        text: 'text-pink-600 dark:text-pink-400',
        border: 'border-pink-200 dark:border-pink-800',
      },
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Heart className="w-10 h-10 text-pink-500 fill-pink-500" />
            <span className="text-2xl font-bold bg-linear-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              WedSite
            </span>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            🧪 Test Users
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            Mockup users สำหรับทดสอบระบบ
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <Button>ไปหน้า Login</Button>
            </Link>
            <Link href="/register">
              <Button variant="outline">ไปหน้า Register</Button>
            </Link>
          </div>
        </div>

        {/* Info Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              📝 วิธีใช้งาน
            </h2>
            <ol className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>1. คลิกปุ่ม "Copy Email" หรือ "Copy Password" เพื่อคัดลอก</li>
              <li>2. ไปที่หน้า Login และวางข้อมูลที่คัดลอก</li>
              <li>3. หรือสร้าง account ใหม่ที่หน้า Register</li>
            </ol>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                ℹ️ ระบบใช้ Supabase Authentication - users จะถูกเก็บใน Supabase Database
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockUsers.map((user) => {
            const Icon = user.icon;
            const colors = getColorClasses(user.color);
            
            return (
              <Card key={user.email} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 ${colors.bg} rounded-full flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${colors.text}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {user.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {user.description}
                      </p>
                    </div>
                    <div className={`px-3 py-1 ${colors.bg} ${colors.text} rounded-full text-xs font-medium`}>
                      {user.plan.toUpperCase()}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Email */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Email
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={user.email}
                          readOnly
                          className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(user.email, user.email)}
                        >
                          {copiedEmail === user.email ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Password
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={user.password}
                          readOnly
                          className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 font-mono"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(user.password, `${user.email}-pwd`)}
                        >
                          {copiedEmail === `${user.email}-pwd` ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Quick Login */}
                    <Link href="/login">
                      <Button className="w-full" size="sm">
                        Login as {user.name.split(' ')[0]}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Commands */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              🔧 คำสั่งที่เป็นประโยชน์
            </h2>
            <div className="space-y-3">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Generate Prisma Client:
                </p>
                <code className="text-sm bg-gray-900 dark:bg-gray-950 text-green-400 px-4 py-2 rounded block">
                  bun run prisma:generate
                </code>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Push Prisma schema to database:
                </p>
                <code className="text-sm bg-gray-900 dark:bg-gray-950 text-green-400 px-4 py-2 rounded block">
                  bun run prisma:push
                </code>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Open Prisma Studio:
                </p>
                <code className="text-sm bg-gray-900 dark:bg-gray-950 text-green-400 px-4 py-2 rounded block">
                  bun run prisma:studio
                </code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>💡 Tip: ใช้ DevTools เพื่อดู session และ cookies หรือเปิด Supabase Dashboard เพื่อดู users</p>
        </div>
      </div>
    </div>
  );
}
