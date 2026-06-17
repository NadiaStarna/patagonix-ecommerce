import { useReducer, useCallback, useMemo } from 'react'
import { CartContext } from './CartContext'
import { cartReducer, initialCartState } from './cartReducer'
import type { CartContextType } from './cart.types'
import type { Product } from '../../types'

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialCartState)

  // Cada función envuelta en useCallback para mantener su referencia estable
  // entre renders, ya que dispatch nunca cambia de identidad
  const addItem = useCallback((product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: product })
  }, [])

  const removeItem = useCallback((productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId })
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } })
  }, [])

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' })
  }, [])

  const itemCount = state.items.reduce((count, item) => count + item.quantity, 0)

  // Memoizamos el value para que solo cambie cuando realmente
  // cambia el estado del carrito, evitando re-renders en cascada
  // en componentes que consumen este contexto (ej: Navbar)
  const value: CartContextType = useMemo(
    () => ({
      ...state,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      itemCount,
    }),
    [state, addItem, removeItem, updateQuantity, clearCart, itemCount]
  )

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}