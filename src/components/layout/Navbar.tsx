import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/auth'
import { ROUTES } from '../../routes/routes'

export const Navbar = () => {
  const { user, logout } = useAuth()
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
              {/* Carrito */}
              <Link to={ROUTES.CART} className="hover:text-aqua transition-colors">
                🛒
              </Link>

              {/* Mis órdenes */}
              <Link to={ROUTES.ORDERS} className="text-sm hover:text-aqua transition-colors">
                Mis órdenes
              </Link>

              {/* Usuario y logout */}
              <span className="text-sm text-aqua hidden md:block">
                {user.displayName}
              </span>
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