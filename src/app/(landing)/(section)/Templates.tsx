import React from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Heart } from 'lucide-react'
import { templates } from '@/components/data/wedding'

const Templates = () => {
  return (
    <section id="templates" className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              เทมเพลตสำเร็จรูป
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              เลือกเทมเพลตที่ใช่สำหรับงานแต่งของคุณ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {templates.map((template) => (
              <Card key={template.id} hover className="overflow-hidden">
                <div
                  className="h-64 flex items-center justify-center"
                  style={{ background: template.preview }}
                >
                  <div className="text-center text-white">
                    <Heart className="w-16 h-16 mx-auto mb-4 fill-white" />
                    <p
                      className={`text-2xl font-prompt `}
                      style={{
                        fontFamily: template.font,
                        color: template.colors.primary,
                      }}
                    >
                      {template.name}
                    </p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-2 dark:text-gray-100">
                    {template.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {template.description}
                  </p>
                  <div className="flex gap-2">
                    {Object.values(template.colors)
                      .slice(0, 4)
                      .map((color, i) => (
                        <div
                          key={i}
                          className={`size-8 rounded-full border-2 border-white dark:border-gray-700 shadow `}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
  )
}

export default Templates
