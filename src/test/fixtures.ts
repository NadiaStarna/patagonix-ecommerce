import type { Product, Order, AppUser } from '../types'

export const mockProduct: Product = {
  id: '1',
  name: 'Mochila de trekking',
  nameLower: 'mochila de trekking',
  description: 'Mochila resistente al agua, ideal para excursiones de varios días.',
  price: 65000,
  stock: 10,
  category: 'trekking',
  imageUrl: 'https://placehold.co/400x300?text=Mochila',
  createdAt: new Date('2026-06-01'),
  updatedAt: new Date('2026-06-01'),
}

export const mockProductSinStock: Product = {
  ...mockProduct,
  id: '2',
  name: 'Carpa Ultraliviana',
  nameLower: 'carpa ultraliviana',
  stock: 0,
}

export const mockUser: AppUser = {
  uid: 'user-123',
  email: 'test@patagonix.com',
  displayName: 'Test User',
  role: 'customer',
  createdAt: new Date('2026-06-01'),
}

export const mockAdmin: AppUser = {
  ...mockUser,
  uid: 'admin-123',
  email: 'admin@patagonix.com',
  displayName: 'Admin User',
  role: 'admin',
}

export const mockOrder: Order = {
  id: 'order-123',
  userId: 'user-123',
  items: [
    {
      productId: '1',
      name: 'Mochila de trekking',
      imageUrl: 'https://placehold.co/400x300?text=Mochila',
      category: 'trekking',
      unitPrice: 65000,
      quantity: 2,
    }
  ],
  total: 130000,
  status: 'pending',
  createdAt: new Date('2026-06-19'),
  updatedAt: new Date('2026-06-19'),
}