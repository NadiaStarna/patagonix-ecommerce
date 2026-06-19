import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/auth'
import { ROUTES } from '../routes/routes'

interface AdminLayoutProps {
  children: React.ReactNode
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.LOGIN)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar con altura fija y scroll interno */}
      <aside className="w-64 bg-stone text-white flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-white/10 shrink-0">
          <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>Patagonix</h1>
          <p className="text-xs text-gray-300 mt-1">Panel de administración</p>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
          <Link
            to={ROUTES.ADMIN_PRODUCTS}
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10 transition text-sm"
          >
            📦 Productos
          </Link>
          <Link
            to={ROUTES.ADMIN_ORDERS}
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10 transition text-sm"
          >
            🧾 Órdenes
          </Link>
          <Link
            to={ROUTES.PRODUCTS}
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10 transition text-sm"
          >
            🛍️ Ver tienda
          </Link>
        </nav>

        {/* Cerrar sesión siempre visible abajo */}
        <div className="p-4 border-t border-white/10 shrink-0">
          <p className="text-xs text-gray-300 mb-2">{user?.displayName}</p>
          <button
            onClick={handleLogout}
            className="w-full text-sm bg-white/10 hover:bg-white/20 py-2 rounded-lg transition"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>

    </div>
  )
}