import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ArrowRight, Sparkles, Check } from 'lucide-react'


const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-pink-50 via-white to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-100 dark:bg-pink-900/30 rounded-full text-pink-600 dark:text-pink-400 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            สร้างเว็บแต่งงานได้ใน 5 นาที
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            สร้าง
            <span className="bg-linear-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              เว็บไซต์งานแต่ง
            </span>
            <br />
            ของคุณเอง
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
            ไม่ต้องเขียนโค้ด ไม่ต้องจ้าง Designer เลือกเทมเพลตสวยๆ
            แล้วปรับแต่งด้วยระบบ Drag & Drop ง่ายๆ
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8">
                เริ่มสร้างเว็บฟรี
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/#templates">
              <Button variant="outline" size="lg" className="text-lg px-8">
                ดูเทมเพลต
              </Button>
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>Free Plan ไม่หมดอายุ</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>ไม่ต้องใส่บัตรเครดิต</span>
            </div>
          </div>
        </div>
      </section>
  )
}

export default Hero
