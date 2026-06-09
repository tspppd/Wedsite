import React from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Palette, Sparkles, Globe } from 'lucide-react'

const Features = () => {
  return (
    <section id="features" className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              ทำไมต้อง <span className="text-pink-500">WedSite</span>?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              ทุกฟีเจอร์ที่คุณต้องการสำหรับเว็บแต่งงาน
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card hover>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Palette className="w-8 h-8 text-pink-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3 dark:text-gray-100">
                  Drag & Drop
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  ลากแล้ววาง Section ต่างๆ จัดเรียงได้ตามต้องการ
                  ไม่ต้องเขียนโค้ด
                </p>
              </CardContent>
            </Card>

            <Card hover>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3 dark:text-gray-100">
                  เทมเพลตสวยๆ
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  เลือกเทมเพลตสำเร็จรูปที่ออกแบบโดย Designer มืออาชีพ
                </p>
              </CardContent>
            </Card>

            <Card hover>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Globe className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3 dark:text-gray-100">
                  แชร์ง่าย
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  ได้ URL ส่วนตัว แชร์ให้แขกผ่าน LINE, Instagram ได้ทันที
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
  )
}

export default Features
