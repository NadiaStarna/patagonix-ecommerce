// src/layouts/AdminLayout.tsx
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/auth'
import { ROUTES } from '../routes/routes'
import {
  Menu, X, LayoutDashboard, ClipboardList, Package, Tag,
  Users, Boxes, Settings, LogOut, Bell, Plus, Mountain, Store,
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
}

const NAV_ITEMS = [
  { label: 'Dashboard', to: ROUTES.ADMIN, icon: LayoutDashboard },
  { label: 'Pedidos', to: ROUTES.ADMIN_ORDERS, icon: ClipboardList },
  { label: 'Productos', to: ROUTES.ADMIN_PRODUCTS, icon: Package },
  { label: 'Categorías', to: ROUTES.ADMIN_CATEGORIES, icon: Tag },
  { label: 'Usuarios', to: ROUTES.ADMIN_USERS, icon: Users },
  { label: 'Inventario', to: ROUTES.ADMIN_INVENTORY, icon: Boxes },
  { label: 'Configuración', to: ROUTES.ADMIN_SETTINGS, icon: Settings },
]

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.LOGIN)
  }

  const handleBellClick = () => {
    alert('Próximamente: resumen enviado por mail')
  }

  const initials = (user?.displayName ?? '')
    .split(' ')
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const renderNavItem = (item: (typeof NAV_ITEMS)[number], onClick?: () => void) => {
    const active = location.pathname === item.to
    return (
      <Link
        key={item.to}
        to={item.to}
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
          active ? 'bg-sunset text-white font-medium' : 'text-gray-300 hover:bg-white/10'
        }`}
      >
        <item.icon size={17} />
        {item.label}
      </Link>
    )
  }

  return (
    <div className="min-h-screen bg-fog flex">

      {/* Sidebar — oculto en mobile, visible en desktop */}
      <aside className="hidden md:flex w-64 bg-navy text-white flex-col h-screen sticky top-0">
        <div className="p-6 flex items-center gap-2 shrink-0">
          <Mountain size={22} className="text-sunset" />
          <div>
            <p className="text-lg font-bold leading-tight" style={{ fontFamily: 'var(--font-display)' }}>Patagonix</p>
            <p className="text-[10px] text-gray-400 tracking-widest">ADMIN</p>
          </div>
        </div>

        <nav className="flex-1 px-4 flex flex-col gap-1 overflow-y-auto">
          <Link
            to={ROUTES.PRODUCTS}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-white/10 transition-colors mb-2 border border-white/10"
          >
            <Store size={17} />
            Volver a la tienda
          </Link>
          {NAV_ITEMS.map(item => renderNavItem(item))}
        </nav>

        <div className="p-4 border-t border-white/10 shrink-0">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-xs font-semibold shrink-0">
              {initials || '?'}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user?.displayName}</p>
              <p className="text-xs text-gray-400">Administradora</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-sm bg-white/10 hover:bg-white/20 py-2 rounded-lg transition"
          >
            <LogOut size={14} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">

        {/* Topbar */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
          <div className="px-4 md:px-8 py-3 flex items-center gap-4">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-stone shrink-0"
              aria-label="Menú"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <div className="flex-1" />

            <div className="flex items-center gap-3 ml-auto shrink-0">
              <button
                onClick={handleBellClick}
                className="relative text-stone hover:text-sunset transition-colors"
              >
                <Bell size={20} />
              </button>
              <Link
                to={ROUTES.ADMIN_PRODUCT_NEW}
                className="flex items-center gap-1.5 bg-sunset text-white px-3 md:px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-90 transition whitespace-nowrap"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">Agregar producto</span>
              </Link>
            </div>
          </div>

          {/* Menú desplegable mobile */}
          {menuOpen && (
            <div className="md:hidden bg-navy text-white px-4 py-3 flex flex-col gap-1">
              <Link
                to={ROUTES.PRODUCTS}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-white/10 transition-colors mb-1 border border-white/10"
              >
                <Store size={17} />
                Volver a la tienda
              </Link>
              {NAV_ITEMS.map(item => renderNavItem(item, () => setMenuOpen(false)))}
              <div className="border-t border-white/10 pt-3 mt-2 flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-xs font-semibold shrink-0">
                  {initials || '?'}
                </span>
                <p className="text-sm font-medium truncate">{user?.displayName}</p>
              </div>
              <button
                onClick={handleLogout}
                className="mt-2 w-full flex items-center justify-center gap-2 text-sm bg-white/10 hover:bg-white/20 py-2 rounded-lg transition"
              >
                <LogOut size={14} />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>

        <main className="flex-1 p-4 md:p-8 overflow-x-hidden overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  )
}