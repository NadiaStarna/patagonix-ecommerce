import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { MainLayout } from '../layouts/MainLayout'
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

        {/* Rutas públicas sin layout */}
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />

        {/* Rutas con MainLayout */}
        <Route path={ROUTES.PRODUCTS} element={
          <MainLayout><Products /></MainLayout>
        } />
        <Route path={ROUTES.CART} element={
          <ProtectedRoute>
            <MainLayout><Cart /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path={ROUTES.CHECKOUT} element={
          <ProtectedRoute>
            <MainLayout><Checkout /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path={ROUTES.ORDERS} element={
          <ProtectedRoute>
            <MainLayout><Orders /></MainLayout>
          </ProtectedRoute>
        } />

        {/* Rutas de administrador */}
        <Route path={ROUTES.ADMIN} element={
          <ProtectedRoute requiredRole="admin">
            <MainLayout><Admin /></MainLayout>
          </ProtectedRoute>
        } />

        {/* Ruta 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}