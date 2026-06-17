import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act } from '../../test/test-utils'
import { renderHook } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '../../test/mocks/firebase'
import { CheckoutPage } from './CheckoutPage'
import { CartProvider, useCart } from '../../contexts/cart'
import { AuthContext } from '../../contexts/auth/AuthContext'
import * as ordersService from '../../services/orders.service'
import type { Product, AppUser } from '../../types'

// Mockeamos el service de órdenes completo: lo que nos importa en este test
// no es si Firestore funciona, sino cuántas veces se INTENTA crear una orden
vi.mock('../../services/orders.service', () => ({
  createOrder: vi.fn(),
}))

const mockProduct: Product = {
  id: '1',
  name: 'Laptop Gaming',
  nameLower: 'laptop gaming',
  description: 'Laptop de alta performance',
  price: 150000,
  stock: 10,
  category: 'electronica',
  imageUrl: 'https://placehold.co/400',
  createdAt: new Date(),
  updatedAt: new Date(),
}

const mockUser: AppUser = {
  uid: 'user_1',
  email: 'test@patagonix.com',
  displayName: 'Usuario Test',
  role: 'customer',
  createdAt: new Date(),
}

// Wrapper que simula un usuario ya autenticado, sin pasar por el login real.
// Inyectamos directamente el value del AuthContext en lugar de usar AuthProvider,
// para no depender de onAuthStateChanged en este test puntual
const AuthenticatedWrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthContext.Provider
    value={{
      user: mockUser,
      loading: false,
      error: null,
      register: vi.fn(),
      login: vi.fn(),
      loginWithGoogle: vi.fn(),
      logout: vi.fn(),
    }}
  >
    <CartProvider>{children}</CartProvider>
  </AuthContext.Provider>
)

describe('CheckoutPage - Prevención de doble submit', () => {

  beforeEach(() => {
    vi.clearAllMocks()
    window.localStorage.clear()
  })

  it('no crea dos órdenes si el usuario hace doble click en confirmar', async () => {
    const user = userEvent.setup()

    // Arrange: agregamos un producto al carrito usando el mismo localStorage
    // que va a leer el CartProvider de CheckoutPage al montarse
    const { result } = renderHook(() => useCart(), { wrapper: AuthenticatedWrapper })
    act(() => {
      result.current.addItem(mockProduct)
    })

    // createOrder tarda un poco en resolver, simulando latencia real de red,
    // para darle tiempo al segundo click de llegar antes de que termine el primero
    let resolveOrder: (value: string) => void
    vi.mocked(ordersService.createOrder).mockImplementation(
      () => new Promise(resolve => { resolveOrder = resolve })
    )

    render(
      <AuthenticatedWrapper>
        <CheckoutPage />
      </AuthenticatedWrapper>
    )

    const confirmButton = screen.getByRole('button', { name: /confirmar compra/i })

    // Act: dos clicks rápidos sobre el botón
    await user.click(confirmButton)
    await user.click(confirmButton)

    // Resolvemos la promesa pendiente para completar el flujo
    act(() => {
      resolveOrder('order_123')
    })

    // Assert: createOrder debería haberse llamado una sola vez, sin importar
    // que el usuario haya hecho click dos veces
    expect(ordersService.createOrder).toHaveBeenCalledTimes(1)
  })

})