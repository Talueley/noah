import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
      <div className="text-center">
        <Image
          src="/logo.png"
          alt="Company Logo"
          width={200}
          height={200}
          className="mb-8"
        />
        <Link
          href="/reserve"
          className="bg-white text-black font-bold py-2 px-4 rounded hover:bg-gray-200 transition-colors"
        >
          开始预约
        </Link>
      </div>
    </main>
  )
}

