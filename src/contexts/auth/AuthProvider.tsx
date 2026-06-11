import { useState, useEffect } from 'react'
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
import type { AuthState } from './auth.types'
import type { AppUser } from '../../types'

// Proveedor de autenticación
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,   // true al inicio porque verificamos si hay sesión activa
    error: null,
  })

  // Se ejecuta una sola vez al montar el componente
  // Firebase nos avisa cada vez que cambia el estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Si hay usuario autenticado, leemos su rol desde Firestore
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
        // Si no hay usuario, limpiamos el estado
        setState({ user: null, loading: false, error: null })
      }
    })

    // Limpiamos el listener cuando el componente se desmonta
    return () => unsubscribe()
  }, [])

  // Registro con email y password
  const register = async (email: string, password: string, displayName: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))

      // Creamos el usuario en Firebase Auth
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password)

      // Actualizamos el nombre en Firebase Auth
      await updateProfile(firebaseUser, { displayName })

      // Guardamos el usuario con su rol en Firestore
      const newUser: AppUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email ?? '',
        displayName,
        role: 'customer',  // Por defecto todos son clientes
        createdAt: new Date(),
      }

      await setDoc(doc(db, 'users', firebaseUser.uid), newUser)

      setState({ user: newUser, loading: false, error: null })
    } catch (error) {
      setState(prev => ({ ...prev, loading: false, error: 'Error al registrarse' }))
    }
  }

  // Login con email y password
  const login = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      await signInWithEmailAndPassword(auth, email, password)
      // onAuthStateChanged se encarga de actualizar el estado
    } catch (error) {
      setState(prev => ({ ...prev, loading: false, error: 'Email o contraseña incorrectos' }))
    }
  }

  // Login con Google
  const loginWithGoogle = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const provider = new GoogleAuthProvider()
      const { user: firebaseUser } = await signInWithPopup(auth, provider)

      // Verificamos si el usuario ya existe en Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))

      if (!userDoc.exists()) {
        // Si es la primera vez que entra con Google, lo guardamos en Firestore
        const newUser: AppUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email ?? '',
          displayName: firebaseUser.displayName ?? '',
          role: 'customer',
          createdAt: new Date(),
        }
        await setDoc(doc(db, 'users', firebaseUser.uid), newUser)
      }
      // onAuthStateChanged se encarga de actualizar el estado
    } catch (error) {
      setState(prev => ({ ...prev, loading: false, error: 'Error al iniciar sesión con Google' }))
    }
  }

  // Logout
  const logout = async () => {
    try {
      await signOut(auth)
      setState({ user: null, loading: false, error: null })
    } catch (error) {
      setState(prev => ({ ...prev, loading: false, error: 'Error al cerrar sesión' }))
    }
  }

  return (
    <AuthContext.Provider value={{ ...state, register, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}