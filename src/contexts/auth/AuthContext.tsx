import { createContext } from 'react'
import type { AuthContextType } from './auth.types'

// Creamos el contexto con valor inicial null
// El ! le dice a TypeScript que confiamos en que nunca va a ser null
// cuando se use dentro del AuthProvider
export const AuthContext = createContext<AuthContextType | null>(null)