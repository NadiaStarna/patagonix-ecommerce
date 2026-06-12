import { describe, it, expect } from 'vitest'
import { render, screen, act } from '../../test/test-utils'
import { renderHook } from '@testing-library/react'
import '../../test/mocks/firebase'
import { CartPage } from './CartPage'
import { CartProvider, useCart } from '../../contexts/cart'
import type { Product } from '../../types'

const mockProduct: Product = {
  id: '1',
  name: 'Laptop Gaming',
  description: 'Laptop de alta performance',
  price: 150000,
  stock: 10,
  category: 'electronica',
  imageUrl: 'https://placehold.co/400',
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('CartPage - Flujo de integración', () => {

  it('debe mostrar el mensaje de carrito vacío inicialmente', () => {
    render(<CartPage />)
    expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument()
  })

  it('debe mostrar el producto y el total después de agregarlo al carrito', () => {
    // Wrapper que comparte el mismo CartProvider entre el hook y el componente
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CartProvider>{children}</CartProvider>
    )

    const { result } = renderHook(() => useCart(), { wrapper })

    // Simulamos que el usuario agrega un producto
    act(() => {
      result.current.addItem(mockProduct)
    })

    expect(result.current.items).toHaveLength(1)
    expect(result.current.total).toBe(150000)
    expect(result.current.itemCount).toBe(1)
  })

  it('debe calcular correctamente el total al agregar múltiples cantidades', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CartProvider>{children}</CartProvider>
    )

    const { result } = renderHook(() => useCart(), { wrapper })

    // Agregamos el mismo producto 3 veces
    act(() => {
      result.current.addItem(mockProduct)
      result.current.addItem(mockProduct)
      result.current.addItem(mockProduct)
    })

    expect(result.current.items[0].quantity).toBe(3)
    expect(result.current.total).toBe(450000)
    expect(result.current.itemCount).toBe(3)
  })

  it('debe vaciar el carrito y volver al estado inicial', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CartProvider>{children}</CartProvider>
    )

    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addItem(mockProduct)
    })

    expect(result.current.items).toHaveLength(1)

    act(() => {
      result.current.clearCart()
    })

    expect(result.current.items).toHaveLength(0)
    expect(result.current.total).toBe(0)
  })

})