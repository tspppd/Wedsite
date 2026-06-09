"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
  Heart,
  Mail,
  Lock,
  AlertCircle,
  Loader2,
  Eye,
  EyeOffIcon,
} from "lucide-react";
import { Button, Input } from "@/components/ui";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { auth } from "@/lib/auth/client";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { authClient } from "@/lib/auth-client";


export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setError("");
    setLoading(true);

    try {
      const { error: signInError } = await auth.signIn(
        data.email,
        data.password,
      );

      if (signInError) {
        setError(signInError.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    setError("");
    if (provider === "google") {
      setGoogleLoading(true);
    } else {
      setFacebookLoading(true);
    }
    await authClient.signIn.social({
      provider: provider,
      // เมื่อล็อกอินเสร็จแล้ว จะให้ระบบเด้งผู้ใช้กลับมาที่หน้าไหน
      callbackURL: "/dashboard",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-pink-50 via-white to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
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
            ยินดีต้อนรับกลับ
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            เข้าสู่ระบบเพื่อจัดการเว็บแต่งงานของคุณ
          </p>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Google Login */}
          <Button
            type="button"
            variant="outline"
            className="w-full mb-6"
            size="lg"
            onClick={() => handleSocialLogin("google")}
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
                เข้าสู่ระบบด้วย Google
              </>
            )}
          </Button>

          {/* Facebook Login */}
          <Button
            type="button"
            variant="outline"
            className="w-full mb-6"
            size="lg"
            onClick={() => handleSocialLogin("facebook")}
            disabled={facebookLoading || loading}
          >
            {facebookLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                กำลังเชื่อมต่อ...
              </>
            ) : (
              <>
                <svg
                  className="w-6 h-6 mr-2"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      fill="url(#paint0_linear_87_7208)"
                    ></circle>{" "}
                    <path
                      d="M21.2137 20.2816L21.8356 16.3301H17.9452V13.767C17.9452 12.6857 18.4877 11.6311 20.2302 11.6311H22V8.26699C22 8.26699 20.3945 8 18.8603 8C15.6548 8 13.5617 9.89294 13.5617 13.3184V16.3301H10V20.2816H13.5617V29.8345C14.2767 29.944 15.0082 30 15.7534 30C16.4986 30 17.2302 29.944 17.9452 29.8345V20.2816H21.2137Z"
                      fill="white"
                    ></path>{" "}
                    <defs>
                      {" "}
                      <linearGradient
                        id="paint0_linear_87_7208"
                        x1="16"
                        y1="2"
                        x2="16"
                        y2="29.917"
                        gradientUnits="userSpaceOnUse"
                      >
                        {" "}
                        <stop stopColor="#18ACFE"></stop>{" "}
                        <stop offset="1" stopColor="#0163E0"></stop>{" "}
                      </linearGradient>{" "}
                    </defs>{" "}
                  </g>
                </svg>
                เข้าสู่ระบบด้วย Facebook
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
                หรือเข้าสู่ระบบด้วยอีเมล
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                อีเมล
              </label>
              <Input
                type="email"
                placeholder="your@email.com"
                disabled={loading || googleLoading || facebookLoading}
                {...register("email")}
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
              <InputGroup>
                <InputGroupInput
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  disabled={loading || googleLoading || facebookLoading}
                  {...register("password")}
                />
                {/* 🎯 แสดงข้อความแจ้งเตือนใต้ Input แทน */}
                {/* <InputGroupAddon align="inline-end">
                  <Button variant={'ghost'}  onClick={(prev)=> setShowPassword(!prev)}>
                    { showPassword ? <Eye /> : <EyeOffIcon />}
                  </Button>
                </InputGroupAddon> */}
              </InputGroup>
                {/* 🎯 แสดงข้อความแจ้งเตือนใต้ Input แทน */}
                {errors.password?.message && (
                  <p className="mt-1 text-xs text-red-500 font-medium">
                    {errors.password?.message}
                  </p>
                )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-pink-500 border-gray-300 dark:border-gray-600 rounded focus:ring-pink-500"
                  disabled={loading || googleLoading}
                />
                <span className="text-gray-600 dark:text-gray-300">
                  จดจำฉันไว้
                </span>
              </label>
              <Link
                href="/forgot-password"
                className="text-pink-500 hover:text-pink-600"
              >
                ลืมรหัสผ่าน?
              </Link>
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
                  กำลังเข้าสู่ระบบ...
                </>
              ) : (
                "เข้าสู่ระบบ"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
            ยังไม่มีบัญชี?{" "}
            <Link
              href="/register"
              className="text-pink-500 hover:text-pink-600 font-medium"
            >
              สมัครสมาชิก
            </Link>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          การเข้าสู่ระบบแสดงว่าคุณยอมรับ{" "}
          <Link href="/terms" className="text-pink-500 hover:underline">
            เงื่อนไขการใช้งาน
          </Link>
        </p>
      </div>
    </div>
  );
}
