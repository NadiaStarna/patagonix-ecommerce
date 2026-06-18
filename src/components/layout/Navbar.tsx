import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, Heart, Mountain } from 'lucide-react'
import { useAuth } from '../../contexts/auth'
import { useCart } from '../../contexts/cart'
import { useFavorites } from '../../contexts/favorites'
import { ROUTES } from '../../routes/routes'

export const Navbar = () => {
  const { user, logout } = useAuth()
  const { itemCount } = useCart()
  const { favoriteIds } = useFavorites()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.LOGIN)
  }

  const handleProductsClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (location.pathname === ROUTES.PRODUCTS) {
      document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate(ROUTES.PRODUCTS, { state: { scrollToCatalog: true } })
    }
  }

  return (
    <header className="bg-stone text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to={ROUTES.PRODUCTS} className="flex items-center gap-2 shrink-0">
          <Mountain size={22} className="text-sunset" />
          <span className="text-2xl font-bold tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
            Patagonix
          </span>
        </Link>

        {/* Navegación central */}
        <nav className="hidden md:flex items-center gap-6 text-sm shrink-0">
          <a href="#catalogo" onClick={handleProductsClick} className="hover:text-sunset transition-colors">
            Productos
          </a>
          {user?.role === 'admin' && (
            <Link to={ROUTES.ADMIN} className="hover:text-sunset transition-colors">
              Admin
            </Link>
          )}
        </nav>

        {/* Acciones derecha */}
        <div className="flex items-center gap-4 shrink-0">
          {user ? (
            <>
              <span className="text-sm text-gray-300 hidden md:block truncate max-w-[200px]" title={user.displayName}>
                ¡Hola, {user.displayName.toUpperCase()}!
              </span>

              <Link to={ROUTES.FAVORITES} className="hover:text-sunset transition-colors relative shrink-0">
                <Heart
                  size={22}
                  className={favoriteIds.length > 0 ? 'text-sunset fill-sunset' : 'text-white'}
                />
                {favoriteIds.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-sunset text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {favoriteIds.length}
                  </span>
                )}
              </Link>

              <Link to={ROUTES.CART} className="hover:text-sunset transition-colors relative shrink-0">
                <ShoppingCart size={22} />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-sunset text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>

              <Link to={ROUTES.ORDERS} className="text-sm underline decoration-white/40 hover:decoration-sunset hover:text-sunset transition-colors shrink-0">
                Mis órdenes
              </Link>

              <button
                onClick={handleLogout}
                className="text-sm bg-sunset hover:bg-opacity-80 text-white px-3 py-1 rounded transition-colors shrink-0"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link
                to={ROUTES.LOGIN}
                className="text-sm hover:text-sunset transition-colors"
              >
                Ingresar
              </Link>
              <Link
                to={ROUTES.REGISTER}
                className="text-sm bg-glacier hover:bg-opacity-80 text-white px-3 py-1 rounded transition-colors"
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