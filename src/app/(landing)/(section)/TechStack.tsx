
import { techStack } from '@/components/data/wedding';

const TechStack = () => {
  return (
    <section className="py-24 bg-gray-900 dark:bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">เทคโนโลยีที่ใช้</h2>
            <p className="text-xl text-gray-400 dark:text-gray-500">
              สร้างด้วยเทคโนโลยีทันสมัย มั่นใจในคุณภาพ
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className="text-center p-4 bg-gray-800 dark:bg-gray-900 rounded-xl"
              >
                <h4 className="font-semibold mb-1">{tech.name}</h4>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  {tech.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
  )
}

export default TechStack
