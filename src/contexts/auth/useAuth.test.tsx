// src/contexts/auth/useAuth.test.tsx
import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import '../../test/mocks/firebase'
import { useAuth } from './useAuth'
import { AuthProvider } from './AuthProvider'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
)

describe('useAuth', () => {

  it('debe retornar el contexto de autenticación', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    expect(result.current).toBeDefined()
  })

  it('debe iniciar con usuario null', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    expect(result.current.user).toBeNull()
  })

  it('debe iniciar con loading en un estado booleano', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    expect(typeof result.current.loading).toBe('boolean')
  })

  it('debe exponer las funciones de autenticación', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    expect(typeof result.current.login).toBe('function')
    expect(typeof result.current.logout).toBe('function')
    expect(typeof result.current.register).toBe('function')
    expect(typeof result.current.loginWithGoogle).toBe('function')
  })

  it('debe lanzar error si se usa fuera del AuthProvider', () => {
    expect(() => {
      renderHook(() => useAuth())
    }).toThrow('useAuth debe usarse dentro de un AuthProvider')
  })

})