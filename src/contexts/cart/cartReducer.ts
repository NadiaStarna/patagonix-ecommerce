import type { CartState, CartAction } from './cart.types'

// Función para calcular el total del carrito
const calculateTotal = (items: CartState['items']): number => {
  const sum = items.reduce((total, item) => total + item.product.price * item.quantity, 0)
  // Redondeamos a 2 decimales para evitar resultados como 30.299999999999997
  // que pueden aparecer por la forma en que JavaScript maneja los flotantes
  return Math.round(sum * 100) / 100
}

// Estado inicial del carrito
export const initialCartState: CartState = {
  items: [],
  total: 0,
}

// El reducer: recibe el estado actual y una acción, devuelve el nuevo estado
export const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {

    case 'ADD_ITEM': {
      // Verificamos si el producto ya está en el carrito
      const existingItem = state.items.find(item => item.product.id === action.payload.id)

      if (existingItem) {
        // Si ya existe, incrementamos la cantidad
        const updatedItems = state.items.map(item =>
          item.product.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
        return { items: updatedItems, total: calculateTotal(updatedItems) }
      }

      // Si no existe, lo agregamos con cantidad 1
      const newItems = [...state.items, { product: action.payload, quantity: 1 }]
      return { items: newItems, total: calculateTotal(newItems) }
    }

    case 'REMOVE_ITEM': {
      const filteredItems = state.items.filter(item => item.product.id !== action.payload)
      return { items: filteredItems, total: calculateTotal(filteredItems) }
    }

    case 'UPDATE_QUANTITY': {
      // Si la cantidad es 0 o menos, eliminamos el item
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