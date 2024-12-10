'use client'

import { useState, useEffect } from 'react'
import AdminAuth from '@/components/AdminAuth'

// 模拟预约数据类型
interface Reservation {
  taobaoId: string
  phone: string
  otherContact: string
  products: string[]
  notes: string
  reservationCode: string
  timestamp: string
}

export default function AdminPage() {
  const [isAuthed, setIsAuthed] = useState(false)
  const [reservations, setReservations] = useState<Reservation[]>([])

  useEffect(() => {
    if (isAuthed) {
      fetch('/api/reserve')
        .then(res => res.json())
        .then(data => setReservations(data.reservations))
        .catch(console.error)
    }
  }, [isAuthed])

  if (!isAuthed) {
    return <AdminAuth onAuth={() => setIsAuthed(true)} />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">预约管理</h1>
        <div className="bg-white rounded-lg shadow">
          <div className="grid grid-cols-[auto,1fr,1fr,1fr,auto] gap-4 p-4 font-bold border-b">
            <div>预约时间</div>
            <div>淘宝ID</div>
            <div>联系方式</div>
            <div>预约商品</div>
            <div>预约码</div>
          </div>
          {reservations.length === 0 ? (
            <p className="text-center py-8 text-gray-500">暂无预约记录</p>
          ) : (
            reservations.map((reservation, index) => (
              <div
                key={index}
                className="grid grid-cols-[auto,1fr,1fr,1fr,auto] gap-4 p-4 border-b hover:bg-gray-50"
              >
                <div className="whitespace-nowrap">{reservation.timestamp}</div>
                <div>{reservation.taobaoId}</div>
                <div>
                  <div>电话: {reservation.phone}</div>
                  {reservation.otherContact && (
                    <div className="text-sm text-gray-500">
                      其他: {reservation.otherContact}
                    </div>
                  )}
                </div>
                <div>
                  <ul className="list-disc pl-4">
                    {reservation.products.map(productId => (
                      <li key={productId}>
                        {inventory[productId]?.name}
                      </li>
                    ))}
                  </ul>
                  {reservation.notes && (
                    <p className="text-sm text-gray-500 mt-1">
                      备注: {reservation.notes}
                    </p>
                  )}
                </div>
                <div className="font-mono">{reservation.reservationCode}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
} 