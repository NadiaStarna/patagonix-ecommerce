import type { Product } from './product.types'

// Estados posibles de una orden
export type OrderStatus = 
  | 'pending'      // recién creada, esperando confirmación
  | 'processing'   // en proceso
  | 'completed'    // completada
  | 'cancelled'    // cancelada

// Un item dentro de una orden (producto + cantidad comprada)
export interface OrderItem {
  product: Product   // El producto completo
  quantity: number   // Cantidad comprada
  unitPrice: number  // Precio al momento de la compra (puede cambiar después)
}

// Interface principal de una orden
export interface Order {
  id: string            // ID único generado por Firestore
  userId: string        // ID del usuario que hizo la compra
  items: OrderItem[]    // Lista de productos comprados
  total: number         // Total de la orden
  status: OrderStatus   // Estado actual
  createdAt: Date       // Fecha de creación
  updatedAt: Date       // Fecha de última modificación
}

// Lo que se necesita para crear una orden nueva
export type CreateOrderDTO = Omit<Order, 'id' | 'createdAt' | 'updatedAt'>