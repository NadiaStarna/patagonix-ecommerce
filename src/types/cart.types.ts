import type { Product } from './product.types'

// Un item dentro del carrito
export interface CartItem {
  product: Product   // El producto completo
  quantity: number   // Cantidad agregada al carrito
}

// El estado completo del carrito
export interface CartState {
  items: CartItem[]   // Lista de items en el carrito
  total: number       // Total calculado automáticamente
}