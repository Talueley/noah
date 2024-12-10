'use client'

import { useSearchParams } from 'next/navigation'
import { inventory } from '@/lib/products'
import Link from 'next/link'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const data = {
    taobaoId: searchParams.get('taobaoId'),
    phone: searchParams.get('phone'),
    otherContact: searchParams.get('otherContact'),
    products: searchParams.get('products')?.split(',') || [],
    notes: searchParams.get('notes'),
    reservationCode: searchParams.get('reservationCode'),
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-green-600">预约成功！</h1>
          <p className="text-gray-600">请截图保存此页面作为预约凭证</p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg space-y-4">
          <div>
            <h2 className="font-bold mb-2">预约码</h2>
            <p className="text-xl font-mono bg-white p-2 rounded border">
              {data.reservationCode}
            </p>
          </div>

          <div>
            <h2 className="font-bold mb-2">预约信息</h2>
            <div className="space-y-2">
              <p>淘宝ID：{data.taobaoId}</p>
              <p>手机号：{data.phone}</p>
              {data.otherContact && <p>其他联系方式：{data.otherContact}</p>}
              <div>
                <p className="font-bold mb-1">预约商品：</p>
                <ul className="list-disc pl-5">
                  {data.products.map(productId => (
                    <li key={productId}>
                      {inventory[productId]?.name} - {inventory[productId]?.price}
                    </li>
                  ))}
                </ul>
              </div>
              {data.notes && (
                <div>
                  <p className="font-bold mb-1">备注：</p>
                  <p className="bg-white p-2 rounded border">{data.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="inline-block bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors"
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  )
} 