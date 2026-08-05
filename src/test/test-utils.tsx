// src/test/test-utils.tsx
import { render, type RenderOptions } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CartProvider } from '../contexts/cart'
import { ToastProvider } from '../contexts/toast'
import { AuthProvider } from '../contexts/auth'
import { FavoritesProvider } from '../contexts/favorites'
import { SettingsProvider } from '../contexts/settings'

const AllProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <MemoryRouter>
      <ToastProvider>
        <SettingsProvider>
          <AuthProvider>
            <FavoritesProvider>
              <CartProvider>
                {children}
              </CartProvider>
            </FavoritesProvider>
          </AuthProvider>
        </SettingsProvider>
      </ToastProvider>
    </MemoryRouter>
  )
}

const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AllProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }