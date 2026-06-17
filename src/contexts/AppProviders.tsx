import { AuthProvider } from './auth'
import { ProductsProvider } from './products'
import { FavoritesProvider } from './favorites'
import { CartProvider } from './cart'

interface AppProvidersProps {
  children: React.ReactNode
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <AuthProvider>
      <ProductsProvider>
        <FavoritesProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </FavoritesProvider>
      </ProductsProvider>
    </AuthProvider>
  )
}