import { useReducer } from 'react'
import { CartContext } from './CartContext'
import { cartReducer, initialCartState } from './cartReducer'
import type { CartContextType } from './cart.types'
import type { Product } from '../../types'

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  // useReducer recibe el reducer y el estado inicial
  const [state, dispatch] = useReducer(cartReducer, initialCartState)

  // Funciones que despachan acciones al reducer
  const addItem = (product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: product })
  }

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  // Total de items para mostrar en el navbar
  const itemCount = state.items.reduce((count, item) => count + item.quantity, 0)

  const value: CartContextType = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    itemCount,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}