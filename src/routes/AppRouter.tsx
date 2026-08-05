import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { ScrollToTop } from './ScrollToTop'
import { MainLayout } from '../layouts/MainLayout'
import { AdminLayout } from '../layouts/AdminLayout'
import { LoginPage } from '../pages/auth/LoginPage'
import { RegisterPage } from '../pages/auth/RegisterPage'
import { LandingPage } from '../components/landing/LandingPage'
import { ProductsPage } from '../pages/products/ProductsPage'
import { AboutPage } from '../pages/about/AboutPage'
import { ProductDetailPage } from '../pages/products/ProductDetailPage'
import { CartPage } from '../pages/cart/CartPage'
import { FavoritesPage } from '../pages/favorites/FavoritesPage'
import { CheckoutPage } from '../pages/checkout/CheckoutPage'
import { OrdersPage } from '../pages/orders/OrdersPage'
import { OrderDetailPage } from '../pages/orders/OrderDetailPage'
import { AdminProductsPage } from '../pages/admin/AdminProductsPage'
import { AdminOrdersPage } from '../pages/admin/AdminOrdersPage'
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage'
import { AdminCategoriesPage } from '../pages/admin/AdminCategoriesPage'
import { AdminUsersPage } from '../pages/admin/AdminUsersPage'
import { AdminInventoryPage } from '../pages/admin/AdminInventoryPage'
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage'
import { ProductFormPage } from '../pages/admin/ProductFormPage'
import { ROUTES } from './routes'

const NotFound = () => <div className="p-8 text-2xl">❌ 404 - Página no encontrada</div>

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Ruta raíz — landing */}
        <Route path={ROUTES.HOME} element={
          <MainLayout><LandingPage /></MainLayout>
        } />

        {/* Rutas públicas sin layout */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

        {/* Rutas con MainLayout */}
        <Route path={ROUTES.PRODUCTS} element={
          <MainLayout><ProductsPage /></MainLayout>
        } />
        <Route path={ROUTES.ABOUT} element={
          <MainLayout><AboutPage /></MainLayout>
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
            <AdminLayout><AdminDashboardPage /></AdminLayout>
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
        <Route path={ROUTES.ADMIN_CATEGORIES} element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout><AdminCategoriesPage /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path={ROUTES.ADMIN_USERS} element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout><AdminUsersPage /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path={ROUTES.ADMIN_INVENTORY} element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout><AdminInventoryPage /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path={ROUTES.ADMIN_SETTINGS} element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout><AdminSettingsPage /></AdminLayout>
          </ProtectedRoute>
        } />

        {/* Ruta 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}