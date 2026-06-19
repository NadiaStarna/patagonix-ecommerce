import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { CartProvider } from './CartProvider'
import { useCart } from './useCart'
import type { Product } from '../../types'

const mockProduct: Product = {
  id: '1',
  name: 'Producto Test',
  nameLower: 'producto test',
  description: 'Descripción de prueba',
  price: 100,
  stock: 10,
  category: 'otros',
  imageUrl: 'https://placehold.co/400',
  createdAt: new Date(),
  updatedAt: new Date(),
}

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
)

describe('useCart', () => {

  it('debe iniciar con el carrito vacío', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    expect(result.current.items).toHaveLength(0)
    expect(result.current.total).toBe(0)
    expect(result.current.itemCount).toBe(0)
  })

  it('debe agregar un producto al carrito', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addItem(mockProduct)
    })

    expect(result.current.items).toHaveLength(1)
    expect(result.current.total).toBe(100)
    expect(result.current.itemCount).toBe(1)
  })

  it('debe eliminar un producto del carrito', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addItem(mockProduct)
    })

    act(() => {
      result.current.removeItem('1')
    })

    expect(result.current.items).toHaveLength(0)
    expect(result.current.total).toBe(0)
  })

  it('debe actualizar la cantidad de un producto', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addItem(mockProduct)
    })

    act(() => {
      result.current.updateQuantity('1', 3)
    })

    expect(result.current.items[0].quantity).toBe(3)
    expect(result.current.total).toBe(300)
  })

  it('debe lanzar un error si se usa fuera del CartProvider', () => {
    expect(() => {
      renderHook(() => useCart())
    }).toThrow('useCart debe usarse dentro de un CartProvider')
  })

})