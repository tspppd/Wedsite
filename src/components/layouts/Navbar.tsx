'use client'

import Link from 'next/link';
import { Heart, Menu, X, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/Button';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useSession, signOut } from '@/lib/auth-client';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
            <span className="text-xl font-bold bg-linear-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              WedSite
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-gray-600 dark:text-gray-300 hover:text-pink-500 transition-colors">
              ฟีเจอร์
            </Link>
            <Link href="#templates" className="text-gray-600 dark:text-gray-300 hover:text-pink-500 transition-colors">
              เทมเพลต
            </Link>
            <Link href="/pricing" className="text-gray-600 dark:text-gray-300 hover:text-pink-500 transition-colors">
              ราคา
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {session?.user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/builder"
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-pink-500"
                >
                  <User className="w-5 h-5" />
                  {session.user.name}
                </Link>
                <Link href="/pricing">
                  <Button size="sm">Upgrade Pro</Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">เข้าสู่ระบบ</Button>
                </Link>
                <Link href="/register">
                  <Button>สมัครสมาชิก</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-800">
          <div className="px-4 py-4 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b dark:border-gray-800">
              <span className="text-sm text-gray-600 dark:text-gray-400">ธีม</span>
              <ThemeToggle />
            </div>
            <Link
              href="#features"
              className="block py-2 text-gray-600 dark:text-gray-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              ฟีเจอร์
            </Link>
            <Link
              href="#templates"
              className="block py-2 text-gray-600 dark:text-gray-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              เทมเพลต
            </Link>
            <Link
              href="/pricing"
              className="block py-2 text-gray-600 dark:text-gray-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              ราคา
            </Link>
            <div className="pt-3 border-t dark:border-gray-800 space-y-2">
              {session?.user ? (
                <>
                  <Link href="/builder" className="block">
                    <Button className="w-full">Builder</Button>
                  </Link>
                  <Button variant="outline" className="w-full" onClick={handleLogout}>
                    ออกจากระบบ
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block">
                    <Button variant="outline" className="w-full">เข้าสู่ระบบ</Button>
                  </Link>
                  <Link href="/register" className="block">
                    <Button className="w-full">สมัครสมาชิก</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
