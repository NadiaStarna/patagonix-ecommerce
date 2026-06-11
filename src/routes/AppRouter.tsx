import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from './routes'

// Páginas temporales mientras construimos la app
const Login = () => <div className="p-8 text-2xl">🔐 Login</div>
const Register = () => <div className="p-8 text-2xl">📝 Register</div>
const Products = () => <div className="p-8 text-2xl">🛍️ Products</div>
const Cart = () => <div className="p-8 text-2xl">🛒 Cart</div>
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

        {/* Rutas de cliente */}
        <Route path={ROUTES.PRODUCTS} element={<Products />} />
        <Route path={ROUTES.CART} element={<Cart />} />

        {/* Rutas de administrador */}
        <Route path={ROUTES.ADMIN} element={<Admin />} />

        {/* Ruta 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}