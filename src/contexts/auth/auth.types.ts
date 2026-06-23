import type { AppUser } from '../../types'

export interface AuthState {
  user: AppUser | null       
  loading: boolean          
  error: string | null        
}

export interface AuthContextType extends AuthState {
  register: (email: string, password: string, displayName: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}