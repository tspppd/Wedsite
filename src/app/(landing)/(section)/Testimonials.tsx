import { Card, CardContent } from '@/components/ui/Card'
import { Star, Heart } from 'lucide-react';

export default function Testimonials() {
  return (

      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              คู่รักที่ใช้ WedSite
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { names: 'คุณแนท & คุณเบส', text: 'ใช้เวลาแค่ 10 นาทีก็ได้เว็บสวยๆ ส่งให้แขกแล้ว แขกชอบกันมาก!' },
              { names: 'คุณมิ้น & คุณกาย', text: 'เทมเพลตสวยมาก ปรับแต่งง่าย คุ้มค่าสุดๆ' },
              { names: 'คุณปลา & คุณปอ', text: 'ระบบ RSVP ช่วยจัดการแขกได้ดีมาก แนะนำเลย!' },
            ].map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">"{testimonial.text}"</p>
                  <p className="font-semibold dark:text-gray-100">{testimonial.names}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

)
    }