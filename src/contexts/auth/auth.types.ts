import type { AppUser } from '../../types'

// El estado de autenticación
export interface AuthState {
  user: AppUser | null        // El usuario autenticado, null si no hay sesión
  loading: boolean            // true mientras verificamos si hay sesión activa
  error: string | null        // mensaje de error si algo falla
}

// Las acciones que puede realizar el contexto
export interface AuthContextType extends AuthState {
  register: (email: string, password: string, displayName: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}