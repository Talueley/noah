'use client'

import { useState } from 'react'

interface AdminAuthProps {
  onAuth: () => void
}

export default function AdminAuth({ onAuth }: AdminAuthProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'RORO0001') {
      onAuth()
    } else {
      setError('密码错误')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">管理员登录</h1>
        <div className="space-y-4">
          <div>
            <label htmlFor="password" className="block mb-1">密码</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded hover:bg-gray-800 transition-colors"
          >
            登录
          </button>
        </div>
      </form>
    </div>
  )
} 