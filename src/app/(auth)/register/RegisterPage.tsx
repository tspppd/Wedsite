'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Heart, Mail, Lock, User, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Button, Input } from '@/components/ui';

// ⚡ 1. เปลี่ยนมาใช้ authClient สไตล์ Better Auth สำหรับ Client Component
import { authClient } from '@/lib/auth-client'; 
import { registerSchema, type RegisterInput } from '@/lib/validations/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch('password', '');
  const confirmPassword = watch('confirmPassword', '');

  // ⚡ 2. ปรับปรุงฟังก์ชันส่งฟอร์มสมัครสมาชิก (Email/Password)
  const onSubmit = async (data: RegisterInput) => {
    setError('');
    setLoading(true);

    try {
      // เรียกใช้ฟังก์ชัน signUp.email ของ Better Auth ได้โดยตรง
      const { data: signUpData, error: signUpError } = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
        // หมายเหตุ: ฟีลด์พิเศษอย่าง plan หรือ role จะถูกตั้งเป็นค่าเริ่มต้นอัตโนมัติที่ตารางหลังบ้านตามที่เราเซ็ตไว้
      });

      if (signUpError) {
        // ดึงข้อความแจ้งเตือนจากหลังบ้านโชว์หน้าจอ (เช่น อีเมลซ้ำ รหัสสั้นเกินไป)
        setError(signUpError.message || 'สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
      } else {
        // เมื่อสมัครสำเร็จ ให้ทำการพ่นผู้ใช้ไปหน้าสร้างเว็บบิวเดอร์
        router.push('/builder');
        router.refresh();
      }
    } catch (err: any) {
      setError('เกิดข้อผิดพลาดของระบบหลังบ้าน กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  // ⚡ 3. ปรับปรุงระบบสมัคร/ล็อกอินด้วยบัญชี Google
  const handleGoogleSignup = async () => {
    setError('');
    setGoogleLoading(true);

    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/builder', // สมัครเสร็จให้ระบบเด้งออโต้ไปหน้านี้
      });
      
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์ Google');
      setGoogleLoading(false);
    }
  };

  const getPasswordStrength = () => {
    if (password.length === 0) return null;
    if (password.length < 8) return { text: 'อ่อนแอ', color: 'text-red-500', bg: 'bg-red-500', width: '33%' };
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return { text: 'ปานกลาง', color: 'text-yellow-500', bg: 'bg-yellow-500', width: '66%' };
    }
    return { text: 'แข็งแรง', color: 'text-green-500', bg: 'bg-green-500', width: '100%' };
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-pink-50 via-white to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Heart className="w-10 h-10 text-pink-500 fill-pink-500" />
            <span className="text-2xl font-bold bg-linear-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              WedSite
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            สร้างบัญชีใหม่
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            เริ่มสร้างเว็บแต่งงานของคุณวันนี้
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Google Signup */}
          <Button
            type="button"
            variant="outline"
            className="w-full mb-6"
            size="lg"
            onClick={handleGoogleSignup}
            disabled={googleLoading || loading}
          >
            {googleLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                กำลังเชื่อมต่อ...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                สมัครสมาชิกด้วย Google
              </>
            )}
          </Button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                หรือสมัครด้วยอีเมล
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                ชื่อ-นามสกุล
              </label>
              <Input
                type="text"
                placeholder="สมชาย ใจดี"
                disabled={loading || googleLoading}
                {...register('name')}
              />
              {/* 🎯 แสดงข้อความแจ้งเตือนใต้ Input แทน */}
                {errors.name?.message && (
                  <p className="mt-1 text-xs text-red-500 font-medium">
                    {errors.name?.message}
                  </p>
                )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                อีเมล
              </label>
              <Input
                type="email"
                placeholder="your@email.com"
                disabled={loading || googleLoading}
                {...register('email')}
              />
              {/* 🎯 แสดงข้อความแจ้งเตือนใต้ Input แทน */}
                {errors.email?.message && (
                  <p className="mt-1 text-xs text-red-500 font-medium">
                    {errors.email?.message}
                  </p>
                )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                รหัสผ่าน
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                disabled={loading || googleLoading}
                {...register('password')}
              />
              {/* 🎯 แสดงข้อความแจ้งเตือนใต้ Input แทน */}
                {errors.password?.message && (
                  <p className="mt-1 text-xs text-red-500 font-medium">
                    {errors.password?.message}
                  </p>
                )}
              {strength && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-500 dark:text-gray-400">ความแข็งแรง:</span>
                    <span className={strength.color}>{strength.text}</span>
                  </div>
                  <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.bg} transition-all duration-300`}
                      style={{ width: strength.width }}
                    />
                  </div>
                </div>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                ต้องมีตัวพิมพ์เล็ก พิมพ์ใหญ่ และตัวเลข
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                ยืนยันรหัสผ่าน
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                disabled={loading || googleLoading}
                {...register('confirmPassword')}
              />
              {/* 🎯 แสดงข้อความแจ้งเตือนใต้ Input แทน */}
                {errors.confirmPassword?.message && (
                  <p className="mt-1 text-xs text-red-500 font-medium">
                    {errors.confirmPassword?.message}
                  </p>
                )}
              {confirmPassword && password && (
                <div className="mt-2 flex items-center gap-2 text-xs">
                  {password === confirmPassword ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-green-600 dark:text-green-400">รหัสผ่านตรงกัน</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <span className="text-red-600 dark:text-red-400">รหัสผ่านไม่ตรงกัน</span>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                required
                disabled={loading || googleLoading}
                className="w-4 h-4 text-pink-500 border-gray-300 dark:border-gray-600 rounded focus:ring-pink-500 mt-0.5"
              />
              <label className="text-sm text-gray-600 dark:text-gray-300">
                ฉันยอมรับ{' '}
                <Link href="/terms" className="text-pink-500 hover:underline">
                  เงื่อนไขการใช้งาน
                </Link>{' '}
                และ{' '}
                <Link href="/privacy" className="text-pink-500 hover:underline">
                  นโยบายความเป็นส่วนตัว
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading || googleLoading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  กำลังสร้างบัญชี...
                </>
              ) : (
                'สมัครสมาชิก'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
            มีบัญชีอยู่แล้ว?{' '}
            <Link href="/login" className="text-pink-500 hover:text-pink-600 font-medium">
              เข้าสู่ระบบ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}