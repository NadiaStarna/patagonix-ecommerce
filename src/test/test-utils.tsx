import type { ReactElement } from 'react'
import { render } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../contexts/auth'
import { CartProvider } from '../contexts/cart'

// Wrapper que provee todos los contextos necesarios para testear componentes
const AllProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

// Función personalizada de render que envuelve automáticamente con los providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllProviders, ...options })

// Re-exportamos todo de testing-library para usar customRender en su lugar
export * from '@testing-library/react'
export { customRender as render }