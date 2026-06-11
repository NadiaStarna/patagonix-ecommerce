import { describe, it, expect } from 'vitest'
import { cartReducer, initialCartState } from './cartReducer'
import type { Product } from '../../types'

// Producto de prueba reutilizable
const mockProduct: Product = {
  id: '1',
  name: 'Producto Test',
  description: 'Descripción de prueba',
  price: 100,
  stock: 10,
  category: 'otros',
  imageUrl: 'https://placehold.co/400',
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('cartReducer', () => {

  it('debe agregar un producto nuevo al carrito', () => {
    const newState = cartReducer(initialCartState, {
      type: 'ADD_ITEM',
      payload: mockProduct,
    })

    expect(newState.items).toHaveLength(1)
    expect(newState.items[0].product.id).toBe('1')
    expect(newState.items[0].quantity).toBe(1)
    expect(newState.total).toBe(100)
  })

  it('debe incrementar la cantidad si el producto ya existe', () => {
    const stateWithItem = cartReducer(initialCartState, {
      type: 'ADD_ITEM',
      payload: mockProduct,
    })

    const newState = cartReducer(stateWithItem, {
      type: 'ADD_ITEM',
      payload: mockProduct,
    })

    expect(newState.items).toHaveLength(1)
    expect(newState.items[0].quantity).toBe(2)
    expect(newState.total).toBe(200)
  })

  it('debe eliminar un producto del carrito', () => {
    const stateWithItem = cartReducer(initialCartState, {
      type: 'ADD_ITEM',
      payload: mockProduct,
    })

    const newState = cartReducer(stateWithItem, {
      type: 'REMOVE_ITEM',
      payload: '1',
    })

    expect(newState.items).toHaveLength(0)
    expect(newState.total).toBe(0)
  })

  it('debe actualizar la cantidad de un producto', () => {
    const stateWithItem = cartReducer(initialCartState, {
      type: 'ADD_ITEM',
      payload: mockProduct,
    })

    const newState = cartReducer(stateWithItem, {
      type: 'UPDATE_QUANTITY',
      payload: { productId: '1', quantity: 5 },
    })

    expect(newState.items[0].quantity).toBe(5)
    expect(newState.total).toBe(500)
  })

  it('debe eliminar el producto si la cantidad actualizada es 0', () => {
    const stateWithItem = cartReducer(initialCartState, {
      type: 'ADD_ITEM',
      payload: mockProduct,
    })

    const newState = cartReducer(stateWithItem, {
      type: 'UPDATE_QUANTITY',
      payload: { productId: '1', quantity: 0 },
    })

    expect(newState.items).toHaveLength(0)
  })

  it('debe limpiar el carrito completamente', () => {
    const stateWithItem = cartReducer(initialCartState, {
      type: 'ADD_ITEM',
      payload: mockProduct,
    })

    const newState = cartReducer(stateWithItem, {
      type: 'CLEAR_CART',
    })

    expect(newState).toEqual(initialCartState)
  })

})