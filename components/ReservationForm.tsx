'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { inventory, type ProductId } from '@/lib/products'

export default function ReservationForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    taobaoId: '',
    phone: '',
    otherContact: '',
    products: [] as ProductId[],
    notes: '',
    reservationCode: '',
  })
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        products: checkbox.checked
          ? [...prev.products, value as ProductId]
          : prev.products.filter(item => item !== value)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.products.length === 0) {
      setError('请至少选择一个产品')
      return
    }

    try {
      const response = await fetch('/api/reserve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Reservation failed')
      }

      const data = await response.json()
      if (data.success) {
        const params = new URLSearchParams({
          taobaoId: formData.taobaoId,
          phone: formData.phone,
          otherContact: formData.otherContact,
          products: formData.products.join(','),
          notes: formData.notes,
          reservationCode: formData.reservationCode,
        })
        
        router.push(`/reserve/success?${params.toString()}`)
      } else {
        setError(data.message || '预约失败，请重试。')
      }
    } catch (err) {
      console.error(err)
      setError('预约失败，请重试。')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="taobaoId" className="block mb-1">淘宝ID</label>
        <input
          type="text"
          id="taobaoId"
          name="taobaoId"
          value={formData.taobaoId}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="phone" className="block mb-1">手机号</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="otherContact" className="block mb-1">其他联系方式（微信/小红书/微博ID）</label>
        <input
          type="text"
          id="otherContact"
          name="otherContact"
          value={formData.otherContact}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <p className="block mb-1">选择物品（可多选）</p>
        <div className="space-y-4">
          {Object.entries(inventory).map(([id, product]) => (
            <label key={id} className="flex items-center space-x-4 p-4 border rounded hover:bg-gray-50">
              <input
                type="checkbox"
                name="products"
                value={id}
                checked={formData.products.includes(id as ProductId)}
                onChange={handleChange}
                disabled={product.stock <= 0}
                className="form-checkbox h-5 w-5"
              />
              {id !== 'coffin-bag-custom' && product.image && (
                <div className="relative w-20 h-20">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-bold">{product.name}</h3>
                <p className="text-gray-600">{product.price}</p>
                <p className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `库存: ${product.stock}` : '已售罄'}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="notes" className="block mb-1">备注</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        ></textarea>
      </div>
      <div>
        <label htmlFor="reservationCode" className="block mb-1">预约码</label>
        <input
          type="text"
          id="reservationCode"
          name="reservationCode"
          value={formData.reservationCode}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" className="w-full bg-black text-white p-2 rounded hover:bg-gray-800 transition-colors">
        提交预约
      </button>
    </form>
  )
}

