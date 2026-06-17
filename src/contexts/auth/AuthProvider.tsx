import { useState, useEffect, useCallback, useMemo } from 'react'
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../../services/firebase'
import { AuthContext } from './AuthContext'
import { getAuthErrorMessage } from '../../utils/authErrors'
import type { AuthState } from './auth.types'
import type { AppUser } from '../../types'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        const userData = userDoc.data()

        const appUser: AppUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email ?? '',
          displayName: firebaseUser.displayName ?? '',
          role: userData?.role ?? 'customer',
          createdAt: userData?.createdAt?.toDate() ?? new Date(),
        }

        setState({ user: appUser, loading: false, error: null })
      } else {
        setState({ user: null, loading: false, error: null })
      }
    })

    return () => unsubscribe()
  }, [])

  const register = useCallback(async (email: string, password: string, displayName: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))

      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(firebaseUser, { displayName })

      const newUser: AppUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email ?? '',
        displayName,
        role: 'customer',
        createdAt: new Date(),
      }

      await setDoc(doc(db, 'users', firebaseUser.uid), newUser)

      setState({ user: newUser, loading: false, error: null })
    } catch (error: any) {
      const message = getAuthErrorMessage(error?.code ?? '')
      setState(prev => ({ ...prev, loading: false, error: message }))
      // Relanzamos el error para que el formulario pueda reaccionar con
      // su propio try/catch, en lugar de depender del estado del context
      // (que se actualiza de forma asíncrona y puede no reflejarse a tiempo)
      throw new Error(message)
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error: any) {
      const message = getAuthErrorMessage(error?.code ?? '')
      setState(prev => ({ ...prev, loading: false, error: message }))
      throw new Error(message)
    }
  }, [])

  const loginWithGoogle = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const provider = new GoogleAuthProvider()
      const { user: firebaseUser } = await signInWithPopup(auth, provider)

      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))

      if (!userDoc.exists()) {
        const newUser: AppUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email ?? '',
          displayName: firebaseUser.displayName ?? '',
          role: 'customer',
          createdAt: new Date(),
        }
        await setDoc(doc(db, 'users', firebaseUser.uid), newUser)
      }
    } catch (error: any) {
      const message = getAuthErrorMessage(error?.code ?? '')
      setState(prev => ({ ...prev, loading: false, error: message }))
      throw new Error(message)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await signOut(auth)
      setState({ user: null, loading: false, error: null })
    } catch (error) {
      setState(prev => ({ ...prev, loading: false, error: 'Error al cerrar sesión' }))
    }
  }, [])

  const value = useMemo(
    () => ({ ...state, register, login, loginWithGoogle, logout }),
    [state, register, login, loginWithGoogle, logout]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}