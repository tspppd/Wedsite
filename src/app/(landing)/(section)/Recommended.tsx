import React from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { recommendedSections } from '@/components/data/wedding'
const Recommended = () => {
  return (
    <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Section ที่แนะนำสำหรับเว็บแต่งงาน
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              เลือก Section ที่เหมาะสมกับงานของคุณ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedSections.map((section, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold dark:text-gray-100">
                      {section.title}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        section.importance === "essential"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : section.importance === "recommended"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {section.importance === "essential"
                        ? "จำเป็น"
                        : section.importance === "recommended"
                          ? "แนะนำ"
                          : "ทางเลือก"}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {section.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
  )
}

export default Recommended
