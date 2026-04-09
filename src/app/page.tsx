
import { Heart, Sparkles, Palette, Globe, Check, ArrowRight, Star } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { templates,recommendedSections ,techStack } from '@/components/data/wedding';
import Link from 'next/link';

export default function page() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-pink-50 via-white to-rose-50">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-100 rounded-full text-pink-600 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            สร้างเว็บแต่งงานได้ใน 5 นาที
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            สร้าง
            <span className="bg-linear-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              เว็บไซต์งานแต่ง
            </span>
            <br />
            ของคุณเอง
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
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

          <div className="mt-12 flex items-center justify-center gap-8 text-gray-500">
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

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              ทำไมต้อง <span className="text-pink-500">WedSite</span>?
            </h2>
            <p className="text-xl text-gray-600">
              ทุกฟีเจอร์ที่คุณต้องการสำหรับเว็บแต่งงาน
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card hover>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Palette className="w-8 h-8 text-pink-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Drag & Drop</h3>
                <p className="text-gray-600">
                  ลากแล้ววาง Section ต่างๆ จัดเรียงได้ตามต้องการ ไม่ต้องเขียนโค้ด
                </p>
              </CardContent>
            </Card>

            <Card hover>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3">เทมเพลตสวยๆ</h3>
                <p className="text-gray-600">
                  เลือกเทมเพลตสำเร็จรูปที่ออกแบบโดย Designer มืออาชีพ
                </p>
              </CardContent>
            </Card>

            <Card hover>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Globe className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3">แชร์ง่าย</h3>
                <p className="text-gray-600">
                  ได้ URL ส่วนตัว แชร์ให้แขกผ่าน LINE, Instagram ได้ทันที
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              เทมเพลตสำเร็จรูป
            </h2>
            <p className="text-xl text-gray-600">
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
                    <p className="text-2xl font-serif" style={{ fontFamily: template.font }}>
                      {template.name}
                    </p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
                  <p className="text-gray-600 mb-4">{template.description}</p>
                  <div className="flex gap-2">
                    {Object.values(template.colors).slice(0, 4).map((color, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full border-2 border-white shadow"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Sections */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Section ที่แนะนำสำหรับเว็บแต่งงาน
            </h2>
            <p className="text-xl text-gray-600">
              เลือก Section ที่เหมาะสมกับงานของคุณ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedSections.map((section, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold">{section.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      section.importance === 'essential'
                        ? 'bg-green-100 text-green-700'
                        : section.importance === 'recommended'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {section.importance === 'essential' ? 'จำเป็น' : section.importance === 'recommended' ? 'แนะนำ' : 'ทางเลือก'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{section.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">เทคโนโลยีที่ใช้</h2>
            <p className="text-xl text-gray-400">
              สร้างด้วยเทคโนโลยีทันสมัย มั่นใจในคุณภาพ
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {techStack.map((tech, index) => (
              <div key={index} className="text-center p-4 bg-gray-800 rounded-xl">
                <h4 className="font-semibold mb-1">{tech.name}</h4>
                <p className="text-sm text-gray-400">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-linear-to-r from-pink-500 to-rose-500">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <Heart className="w-16 h-16 mx-auto mb-6 fill-white" />
          <h2 className="text-4xl font-bold mb-4">
            พร้อมสร้างเว็บแต่งงานของคุณแล้วหรือยัง?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            เริ่มต้นฟรี ไม่ต้องใส่บัตรเครดิต สร้างเสร็จใน 5 นาที
          </p>
          <Link href="/register">
            <Button  size="lg" className=" text-pink-500 hover:bg-gray-100 text-lg px-8">
              เริ่มสร้างเว็บเลย
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
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
                  <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
                  <p className="font-semibold">{testimonial.names}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
