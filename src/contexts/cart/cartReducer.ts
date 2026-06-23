import type { CartState, CartAction } from './cart.types'

const calculateTotal = (items: CartState['items']): number => {
  const sum = items.reduce((total, item) => total + item.product.price * item.quantity, 0)
  return Math.round(sum * 100) / 100
}

export const initialCartState: CartState = {
  items: [],
  total: 0,
}

export const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {

    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.product.id === action.payload.id)

      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.product.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
        return { items: updatedItems, total: calculateTotal(updatedItems) }
      }

      const newItems = [...state.items, { product: action.payload, quantity: 1 }]
      return { items: newItems, total: calculateTotal(newItems) }
    }

    case 'REMOVE_ITEM': {
      const filteredItems = state.items.filter(item => item.product.id !== action.payload)
      return { items: filteredItems, total: calculateTotal(filteredItems) }
    }

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        const filteredItems = state.items.filter(item => item.product.id !== action.payload.productId)
        return { items: filteredItems, total: calculateTotal(filteredItems) }
      }

      const updatedItems = state.items.map(item =>
        item.product.id === action.payload.productId
          ? { ...item, quantity: action.payload.quantity }
          : item
      )
      return { items: updatedItems, total: calculateTotal(updatedItems) }
    }

    case 'CLEAR_CART': {
      return initialCartState
    }

    default:
      return state
  }
}