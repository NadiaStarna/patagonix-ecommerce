import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/auth'
import { ROUTES } from './routes'
import type { UserRole } from '../types'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole  // Si no se pasa, solo requiere sesión activa
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, loading } = useAuth()

  // Mientras verificamos si hay sesión, no redirigimos todavía
  // Esto evita redireccionamientos prematuros
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-500">Cargando...</p>
    </div>
  }

  // Si no hay usuario autenticado, redirigimos al login
  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  // Si se requiere un rol específico y el usuario no lo tiene
  // redirigimos a productos
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={ROUTES.PRODUCTS} replace />
  }

  // Si todo está bien, mostramos el contenido
  return <>{children}</>
}