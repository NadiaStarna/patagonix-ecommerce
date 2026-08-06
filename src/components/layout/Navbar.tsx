import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, Heart, Mountain, Menu, X, Search, ChevronDown, Truck, Headphones, User } from 'lucide-react'
import { useAuth } from '../../contexts/auth'
import { useCart } from '../../contexts/cart'
import { useFavorites } from '../../contexts/favorites'
import { useProducts } from '../../contexts/products'
import { useSettings } from '../../contexts/settings'
import { ROUTES } from '../../routes/routes'
import { CATEGORIES } from '../../utils/categories'

export const Navbar = () => {
  const { user, logout } = useAuth()
  const { itemCount } = useCart()
  const { favoriteIds } = useFavorites()
  const { setSearchQuery, setSelectedCategory } = useProducts()
  const { settings } = useSettings()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const goToCatalog = () => {
    if (location.pathname === ROUTES.PRODUCTS) {
      document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate(ROUTES.PRODUCTS, { state: { scrollToCatalog: true } })
    }
  }

  const handleLogout = async () => {
    await logout()
    setMenuOpen(false)
    setAccountOpen(false)
    navigate(ROUTES.LOGIN)
  }

  const handleProductsClick = () => {
    setMenuOpen(false)
    goToCatalog()
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchQuery(searchValue)
    setMenuOpen(false)
    goToCatalog()
  }

  const handleCategorySelect = (value: (typeof CATEGORIES)[number]['value']) => {
    setSelectedCategory(value)
    setCategoriesOpen(false)
    setMenuOpen(false)
    goToCatalog()
  }

  const handleContactoClick = () => {
    setMenuOpen(false)
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })
  }

  const firstName = user?.displayName?.split(' ')[0] ?? ''

  return (
    <header className="shadow-sm relative z-40">
      {/* Barra de anuncio */}
      <div className="bg-navy text-white text-xs">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 truncate">
            <Truck size={13} className="text-amber-100 shrink-0" />
            Envío gratis en compras mayores a ${settings.freeShippingThreshold.toLocaleString('es-AR')}
          </span>
          <div className="hidden sm:flex items-center gap-4 shrink-0">
            <Link
              to={user ? ROUTES.ORDERS : ROUTES.LOGIN}
              className="hover:text-sunset transition-colors"
            >
              Seguí tu pedido
            </Link>
            <span className="flex items-center gap-1.5">
              <Headphones size={13} className="text-amber-100" />
              <button onClick={handleContactoClick} className="hover:text-sunset transition-colors">
                Contacto
              </button>
            </span>
          </div>
        </div>
      </div>

      {/* Navbar principal */}
      <div className="bg-white text-stone">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-6">

          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center gap-2 shrink-0" onClick={() => setMenuOpen(false)}>
            <Mountain size={22} className="text-sunset" />
            <span className="text-2xl font-bold tracking-wide hidden sm:inline" style={{ fontFamily: 'var(--font-display)' }}>
              {settings.storeName}
            </span>
          </Link>

          {/* Buscador — desktop, pegado al logo */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex w-full max-w-md">
            <div className="relative w-full">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                placeholder="Buscar productos, categorías o marcas..."
                className="w-full bg-fog text-stone placeholder-gray-400 border border-gray-200 rounded-lg pl-9 pr-12 py-1.5 text-sm focus:outline-none focus:border-glacier"
              />
              <span className="hidden lg:flex absolute right-2.5 top-1/2 -translate-y-1/2 items-center border border-gray-300 rounded px-1.5 py-0.5 text-[10px] text-gray-400 bg-white">
                ⌘K
              </span>
            </div>
          </form>

          {/* Categorías — desktop */}
          <div className="hidden md:flex flex-1 items-center">
            <div className="relative">
              <button
                onClick={() => setCategoriesOpen(o => !o)}
                onBlur={() => setTimeout(() => setCategoriesOpen(false), 150)}
                className="flex items-center gap-1 text-sm hover:text-sunset transition-colors whitespace-nowrap"
              >
                Categorías
                <ChevronDown size={14} className={`transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} />
              </button>
              {categoriesOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white text-stone rounded-lg shadow-lg py-2 w-48 z-50 border border-gray-100">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.value}
                      onClick={() => handleCategorySelect(cat.value)}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-fog flex items-center gap-2"
                    >
                      <cat.icon size={15} className="text-glacier" />
                      {cat.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Acciones derecha */}
          <div className="flex items-center gap-4 shrink-0 ml-auto pl-0 md:pl-5 md:border-l md:border-gray-200">
            {user ? (
              <>
                {/* Favoritos */}
                <Link to={ROUTES.FAVORITES} className="hidden md:flex items-center gap-1.5 text-sm hover:text-sunset transition-colors relative shrink-0">
                  <Heart
                    size={16}
                    className={favoriteIds.length > 0 ? 'text-sunset fill-sunset' : 'text-stone'}
                  />
                  Favoritos
                  {favoriteIds.length > 0 && (
                    <span className="absolute -top-2 -left-2 bg-sunset text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                      {favoriteIds.length}
                    </span>
                  )}
                </Link>
                <Link to={ROUTES.FAVORITES} className="md:hidden hover:text-sunset transition-colors relative shrink-0">
                  <Heart
                    size={20}
                    className={favoriteIds.length > 0 ? 'text-sunset fill-sunset' : 'text-stone'}
                  />
                  {favoriteIds.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-sunset text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                      {favoriteIds.length}
                    </span>
                  )}
                </Link>

                {/* Carrito */}
                <Link to={ROUTES.CART} className="hidden md:flex items-center gap-1.5 text-sm hover:text-sunset transition-colors relative shrink-0">
                  <ShoppingCart size={16} />
                  Carrito
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -left-2 bg-sunset text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>
                <Link to={ROUTES.CART} className="md:hidden hover:text-sunset transition-colors relative shrink-0">
                  <ShoppingCart size={20} />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-sunset text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>

                {/* Mi cuenta — desktop, dropdown unificado */}
                <div className="hidden md:block relative">
                  <button
                    onClick={() => setAccountOpen(o => !o)}
                    onBlur={() => setTimeout(() => setAccountOpen(false), 150)}
                    className="flex items-center gap-1.5 text-sm hover:text-sunset transition-colors"
                  >
                    <User size={16} />
                    <span className="max-w-[110px] truncate">{firstName}</span>
                    <ChevronDown size={14} className={`transition-transform ${accountOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {accountOpen && (
                    <div className="absolute top-full right-0 mt-2 bg-white text-stone rounded-lg shadow-lg py-2 w-52 z-50 border border-gray-100">
                      <p className="px-4 py-1.5 text-xs text-gray-400 truncate border-b border-gray-100 mb-1">
                        {user.displayName}
                      </p>
                      <Link
                        to={ROUTES.ORDERS}
                        onClick={() => setAccountOpen(false)}
                        className="block px-4 py-2 text-sm hover:bg-fog"
                      >
                        Mis órdenes
                      </Link>
                      {(user.role === 'admin' || user.role === 'demo') && (
                        <Link
                          to={ROUTES.ADMIN}
                          onClick={() => setAccountOpen(false)}
                          className="block px-4 py-2 text-sm hover:bg-fog"
                        >
                          Admin
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-sunset hover:bg-fog"
                      >
                        Salir
                      </button>
                    </div>
                  )}
                </div>

                {/* Hamburguesa — solo mobile */}
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="md:hidden text-stone"
                  aria-label="Menú"
                >
                  {menuOpen ? <X size={24} /> : <Menu size={24} />}
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
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="md:hidden text-stone"
                  aria-label="Menú"
                >
                  {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Menú desplegable mobile */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 flex flex-col gap-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                placeholder="Buscar productos..."
                className="w-full bg-fog text-stone placeholder-gray-400 border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none"
              />
            </form>

            {user && (
              <p className="text-sm text-gray-500">¡Hola, {user.displayName.toUpperCase()}!</p>
            )}

            <button
              onClick={handleProductsClick}
              className="text-sm hover:text-sunset transition-colors text-left"
            >
              Productos
            </button>

            <div className="flex flex-col gap-2 pl-2 border-l border-gray-200">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => handleCategorySelect(cat.value)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-sunset transition-colors text-left"
                >
                  <cat.icon size={14} />
                  {cat.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleContactoClick}
              className="text-sm hover:text-sunset transition-colors text-left"
            >
              Contacto
            </button>

            {user && (
              <>
                <Link
                  to={ROUTES.ORDERS}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm hover:text-sunset transition-colors"
                >
                  Mis órdenes
                </Link>
                {(user.role === 'admin' || user.role === 'demo') && (
                  <Link
                    to={ROUTES.ADMIN}
                    onClick={() => setMenuOpen(false)}
                    className="text-sm hover:text-sunset transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-sm bg-sunset hover:bg-opacity-80 text-white px-3 py-1 rounded transition-colors text-left w-fit"
                >
                  Salir
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}