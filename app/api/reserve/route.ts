import { NextResponse } from 'next/server'

// Mock database of valid reservation codes
const validCodes = new Map([
  ['IFZKM', { used: false, expiresAt: new Date('2024-12-31') }],
  ['BIGMM', { used: false, expiresAt: new Date('2024-12-31') }],
  ['9V7U3', { used: false, expiresAt: new Date('2024-12-31') }],
  ['J5RPM', { used: false, expiresAt: new Date('2024-12-31') }],
  ['RAQBL', { used: false, expiresAt: new Date('2024-12-31') }],
  ['C7DBV', { used: false, expiresAt: new Date('2024-12-31') }],
  ['W5SE3', { used: false, expiresAt: new Date('2024-12-31') }],
  ['J0NTT', { used: false, expiresAt: new Date('2024-12-31') }],
  ['22S8Q', { used: false, expiresAt: new Date('2024-12-31') }],
  ['EYR0W', { used: false, expiresAt: new Date('2024-12-31') }],
  ['EFPTF', { used: false, expiresAt: new Date('2024-12-31') }],
  ['VZU8Q', { used: false, expiresAt: new Date('2024-12-31') }],
  ['M0FZ4', { used: false, expiresAt: new Date('2024-12-31') }],
]);

// Mock product inventory
const inventory = {
  'coffin-bag-white': {
    name: '葬骨之棺手提包-白色',
    stock: 10
  },
  'coffin-bag-black': {
    name: '葬骨之棺手提包-黑色',
    stock: 5
  },
  'coffin-bag-custom': {
    name: '葬骨之棺手提包-定制版',
    stock: 8
  },
  'heart-bag-white-devil': {
    name: '心脏手提包（纯白恶魔）',
    stock: 5
  }
}

// 在文件顶部添加类型定义
type ProductId = keyof typeof inventory

export async function POST(request: Request) {
  const body = await request.json()
  const { reservationCode, products } = body as { 
    reservationCode: string, 
    products: ProductId[] 
  }

  // 检查预约码是否存在且有效
  const codeDetails = validCodes.get(reservationCode)
  if (!codeDetails) {
    return NextResponse.json({ success: false, message: '无效的预约码' }, { status: 400 })
  }

  // 检查预约码是否已使用
  if (codeDetails.used) {
    return NextResponse.json({ success: false, message: '预约码已被使用' }, { status: 400 })
  }

  // 检查预约码是否过期
  if (new Date() > codeDetails.expiresAt) {
    return NextResponse.json({ success: false, message: '预约码已过期' }, { status: 400 })
  }

  // Check if all products are in stock
  for (const productId of products) {
    if (!inventory[productId] || inventory[productId].stock <= 0) {
      return NextResponse.json({ 
        success: false, 
        message: `${inventory[productId]?.name || productId} 库存不足` 
      }, { status: 400 })
    }
  }
  
  // Decrease inventory for all selected products
  for (const productId of products) {
    inventory[productId].stock--
  }

  // 标记预约码为已使用
  codeDetails.used = true
  validCodes.set(reservationCode, codeDetails)

  // In a real application, you would save the reservation details to a database here

  return NextResponse.json({ success: true, message: '预约成功' })
}

