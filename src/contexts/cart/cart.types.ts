import type { Product } from '../../types'

// Un item dentro del carrito
export interface CartItem {
  product: Product
  quantity: number
}

// El estado completo del carrito
export interface CartState {
  items: CartItem[]
  total: number
}

// Todas las acciones posibles del carrito
export type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string }        // payload es el id del producto
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }

// Lo que expone el contexto
export interface CartContextType extends CartState {
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  itemCount: number   // total de items en el carrito para mostrar en el navbar
}