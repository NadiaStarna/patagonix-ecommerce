import { useReducer, useCallback, useMemo, useEffect } from 'react'
import { CartContext } from './CartContext'
import { cartReducer, initialCartState } from './cartReducer'
import type { CartContextType, CartState } from './cart.types'
import type { Product } from '../../types'

const STORAGE_KEY = 'patagonix_cart'

const calculateTotal = (items: CartState['items']): number => {
  const sum = items.reduce((total, item) => total + item.product.price * item.quantity, 0)
  return Math.round(sum * 100) / 100
}

const loadFromStorage = (): CartState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return initialCartState

    const parsed = JSON.parse(stored) as CartState

    const items = parsed.items.map(item => ({
      ...item,
      product: {
        ...item.product,
        createdAt: new Date(item.product.createdAt),
        updatedAt: new Date(item.product.updatedAt),
      },
    }))

    return { items, total: calculateTotal(items) }
  } catch {
    return initialCartState
  }
}

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadFromStorage)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

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