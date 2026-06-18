import { AuthProvider } from './auth'
import { ProductsProvider } from './products'
import { FavoritesProvider } from './favorites'
import { CartProvider } from './cart'
import { ToastProvider } from './toast'

interface AppProvidersProps {
  children: React.ReactNode
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <ToastProvider>
      <AuthProvider>
        <ProductsProvider>
          <FavoritesProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </FavoritesProvider>
        </ProductsProvider>
      </AuthProvider>
    </ToastProvider>
  )
}