import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { ROUTES } from './routes'

// Páginas temporales mientras construimos la app
const Login = () => <div className="p-8 text-2xl">🔐 Login</div>
const Register = () => <div className="p-8 text-2xl">📝 Register</div>
const Products = () => <div className="p-8 text-2xl">🛍️ Products</div>
const Cart = () => <div className="p-8 text-2xl">🛒 Cart</div>
const Checkout = () => <div className="p-8 text-2xl">💳 Checkout</div>
const Orders = () => <div className="p-8 text-2xl">📦 Orders</div>
const Admin = () => <div className="p-8 text-2xl">👨‍💼 Admin</div>
const NotFound = () => <div className="p-8 text-2xl">❌ 404 - Página no encontrada</div>

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta raíz redirige a productos */}
        <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.PRODUCTS} replace />} />

        {/* Rutas públicas */}
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />

        {/* Rutas de cliente - requieren sesión activa */}
        <Route path={ROUTES.PRODUCTS} element={<Products />} />
        <Route path={ROUTES.CART} element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        } />
        <Route path={ROUTES.CHECKOUT} element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        } />
        <Route path={ROUTES.ORDERS} element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        } />

        {/* Rutas de administrador - requieren rol admin */}
        <Route path={ROUTES.ADMIN} element={
          <ProtectedRoute requiredRole="admin">
            <Admin />
          </ProtectedRoute>
        } />

        {/* Ruta 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}