import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { MainLayout } from '../layouts/MainLayout'
import { AdminLayout } from '../layouts/AdminLayout'
import { LoginPage } from '../pages/auth/LoginPage'
import { RegisterPage } from '../pages/auth/RegisterPage'
import { ProductsPage } from '../pages/products/ProductsPage'
import { ProductDetailPage } from '../pages/products/ProductDetailPage'
import { CartPage } from '../pages/cart/CartPage'
import { FavoritesPage } from '../pages/favorites/FavoritesPage'
import { CheckoutPage } from '../pages/checkout/CheckoutPage'
import { OrdersPage } from '../pages/orders/OrdersPage'
import { OrderDetailPage } from '../pages/orders/OrderDetailPage'
import { AdminProductsPage } from '../pages/admin/AdminProductsPage'
import { AdminOrdersPage } from '../pages/admin/AdminOrdersPage'
import { ProductFormPage } from '../pages/admin/ProductFormPage'
import { ROUTES } from './routes'

const NotFound = () => <div className="p-8 text-2xl">❌ 404 - Página no encontrada</div>

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta raíz redirige a productos */}
        <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.PRODUCTS} replace />} />

        {/* Rutas públicas sin layout */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

        {/* Rutas con MainLayout */}
        <Route path={ROUTES.PRODUCTS} element={
          <MainLayout><ProductsPage /></MainLayout>
        } />
        <Route path={ROUTES.PRODUCT_DETAIL} element={
          <MainLayout><ProductDetailPage /></MainLayout>
        } />
        <Route path={ROUTES.CART} element={
          <ProtectedRoute>
            <MainLayout><CartPage /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path={ROUTES.FAVORITES} element={
          <ProtectedRoute>
            <MainLayout><FavoritesPage /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path={ROUTES.CHECKOUT} element={
          <ProtectedRoute>
            <MainLayout><CheckoutPage /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path={ROUTES.ORDERS} element={
          <ProtectedRoute>
            <MainLayout><OrdersPage /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path={ROUTES.ORDER_DETAIL} element={
          <ProtectedRoute>
            <MainLayout><OrderDetailPage /></MainLayout>
          </ProtectedRoute>
        } />

        {/* Rutas de administrador con AdminLayout */}
        <Route path={ROUTES.ADMIN} element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout><AdminProductsPage /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path={ROUTES.ADMIN_PRODUCTS} element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout><AdminProductsPage /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path={ROUTES.ADMIN_PRODUCT_NEW} element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout><ProductFormPage /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path={ROUTES.ADMIN_PRODUCT_EDIT} element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout><ProductFormPage /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path={ROUTES.ADMIN_ORDERS} element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout><AdminOrdersPage /></AdminLayout>
          </ProtectedRoute>
        } />

        {/* Ruta 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}