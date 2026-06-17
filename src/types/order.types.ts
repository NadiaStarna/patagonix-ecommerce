import type { ProductCategory } from './product.types'

// Estados posibles de una orden
export type OrderStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'cancelled'

// Un item dentro de una orden — guarda un SNAPSHOT del producto al momento
// de la compra, no una referencia. Así, si el producto cambia de precio o
// se elimina después, la orden sigue mostrando exactamente lo que se compró.
export interface OrderItem {
  productId: string         // referencia al producto original
  name: string               // nombre al momento de la compra
  imageUrl: string            // imagen al momento de la compra
  category: ProductCategory   // categoría al momento de la compra
  unitPrice: number           // precio al momento de la compra
  quantity: number            // cantidad comprada
}

// Interface principal de una orden
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