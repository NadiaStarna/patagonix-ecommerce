import type { ProductCategory } from './product.types'

export type OrderStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'cancelled'

export interface OrderItem {
  productId: string       
  name: string             
  imageUrl: string            
  category: ProductCategory   
  unitPrice: number           
  quantity: number            
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  createdAt: Date
  updatedAt: Date
}

export type CreateOrderDTO = Omit<Order, 'id' | 'createdAt' | 'updatedAt'>