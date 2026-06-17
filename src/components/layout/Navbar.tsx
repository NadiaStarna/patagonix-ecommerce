import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Heart } from 'lucide-react'
import { useAuth } from '../../contexts/auth'
import { useCart } from '../../contexts/cart'
import { useFavorites } from '../../contexts/favorites'
import { ROUTES } from '../../routes/routes'

export const Navbar = () => {
  const { user, logout } = useAuth()
  const { itemCount } = useCart()
  const { favoriteIds } = useFavorites()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.LOGIN)
  }

  return (
    <header className="bg-navy text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to={ROUTES.PRODUCTS} className="text-2xl font-bold text-gold tracking-wide">
          Patagonix
        </Link>

        {/* Navegación central */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link to={ROUTES.PRODUCTS} className="hover:text-aqua transition-colors">
            Productos
          </Link>
          {user?.role === 'admin' && (
            <Link to={ROUTES.ADMIN} className="hover:text-aqua transition-colors">
              Admin
            </Link>
          )}
        </nav>

        {/* Acciones derecha */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* Favoritos con contador */}
              <Link to={ROUTES.FAVORITES} className="hover:text-aqua transition-colors relative">
                <Heart
                  size={22}
                  className={favoriteIds.length > 0 ? 'text-red-400 fill-red-400' : 'text-white'}
                />
                {favoriteIds.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gold text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {favoriteIds.length}
                  </span>
                )}
              </Link>

              {/* Carrito con contador */}
              <Link to={ROUTES.CART} className="hover:text-aqua transition-colors relative">
                <ShoppingCart size={22} />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gold text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* Mis órdenes */}
              <Link to={ROUTES.ORDERS} className="text-sm hover:text-aqua transition-colors">
                Mis órdenes
              </Link>

              {/* Usuario */}
              <span className="text-sm text-aqua hidden md:block">
                {user.displayName}
              </span>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="text-sm bg-gold hover:bg-opacity-80 text-white px-3 py-1 rounded transition-colors"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link
                to={ROUTES.LOGIN}
                className="text-sm hover:text-aqua transition-colors"
              >
                Ingresar
              </Link>
              <Link
                to={ROUTES.REGISTER}
                className="text-sm bg-teal hover:bg-opacity-80 text-white px-3 py-1 rounded transition-colors"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  )
}