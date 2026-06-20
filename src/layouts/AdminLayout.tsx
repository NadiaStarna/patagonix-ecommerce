// src/layouts/AdminLayout.tsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/auth'
import { ROUTES } from '../routes/routes'
import { Menu, X } from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.LOGIN)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar — oculto en mobile, visible en desktop */}
      <aside className="hidden md:flex w-64 bg-stone text-white flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-white/10 shrink-0">
          <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>Patagonix</h1>
          <p className="text-xs text-gray-300 mt-1">Panel de administración</p>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
          <Link to={ROUTES.ADMIN_PRODUCTS} className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10 transition text-sm">
            📦 Productos
          </Link>
          <Link to={ROUTES.ADMIN_ORDERS} className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10 transition text-sm">
            🧾 Órdenes
          </Link>
          <Link to={ROUTES.PRODUCTS} className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10 transition text-sm">
            🛍️ Ver tienda
          </Link>
        </nav>

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
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">

        {/* Header mobile con hamburguesa */}
        <div className="md:hidden bg-stone text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40">
          <div>
            <p className="font-bold text-sm" style={{ fontFamily: 'var(--font-display)' }}>Patagonix</p>
            <p className="text-xs text-gray-300">Panel de administración</p>
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white"
            aria-label="Menú"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Menú desplegable mobile */}
        {menuOpen && (
          <div className="md:hidden bg-stone text-white px-4 py-3 flex flex-col gap-2 z-30">
            <Link
              to={ROUTES.ADMIN_PRODUCTS}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10 transition text-sm"
            >
              📦 Productos
            </Link>
            <Link
              to={ROUTES.ADMIN_ORDERS}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10 transition text-sm"
            >
              🧾 Órdenes
            </Link>
            <Link
              to={ROUTES.PRODUCTS}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10 transition text-sm"
            >
              🛍️ Ver tienda
            </Link>
            <div className="border-t border-white/10 pt-2 mt-1">
              <p className="text-xs text-gray-300 mb-2">{user?.displayName}</p>
              <button
                onClick={handleLogout}
                className="w-full text-sm bg-white/10 hover:bg-white/20 py-2 rounded-lg transition"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        )}

        <main className="flex-1 p-4 md:p-8 overflow-x-hidden overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  )
}