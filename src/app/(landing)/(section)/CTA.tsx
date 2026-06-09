import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ArrowRight, Heart } from 'lucide-react'

const CTA = () => {
  return (
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
  )
}

export default CTA
