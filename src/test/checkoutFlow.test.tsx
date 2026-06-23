// src/test/checkoutFlow.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from './test-utils'
import './mocks/firebase'
import { mockProduct } from './fixtures'

vi.mock('../services/orders.service', () => ({
  createOrder: vi.fn().mockResolvedValue('order-123'),
}))

vi.mock('../services/products.service', () => ({
  getProductById: vi.fn().mockResolvedValue(mockProduct),
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

import { CartPage } from '../pages/cart/CartPage'
import { CheckoutPage } from '../pages/checkout/CheckoutPage'
import { ProductCard } from '../components/common/ProductCard'

describe('Flujo completo de checkout', () => {

  beforeEach(() => {
    mockNavigate.mockClear()
    localStorage.clear()
  })

  it('ProductCard muestra botón de agregar al carrito', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('Agregar')).toBeInTheDocument()
  })

  it('ProductCard muestra el botón Ver detalle', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('Ver detalle')).toBeInTheDocument()
  })

  it('ProductCard muestra el nombre del producto', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('Mochila de trekking')).toBeInTheDocument()
  })

  it('CartPage muestra estado vacío cuando no hay productos', () => {
    render(<CartPage />)
    expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument()
  })

  it('CheckoutPage muestra estado vacío cuando el carrito está vacío', () => {
    render(<CheckoutPage />)
    expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument()
  })

  it('CheckoutPage muestra botón de ir al catálogo cuando está vacío', () => {
    render(<CheckoutPage />)
    expect(screen.getByText('Ir al catálogo')).toBeInTheDocument()
  })

})