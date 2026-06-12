import { vi } from 'vitest'

// Mock de Firebase Auth
export const mockAuth = {
  currentUser: null,
}

vi.mock('../../services/firebase', () => ({
  auth: mockAuth,
  db: {},
}))

// Mock de las funciones de firebase/auth
vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn((_auth, callback) => {
    // Simulamos que no hay usuario autenticado por defecto
    callback(null)
    return () => {} // unsubscribe
  }),
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  updateProfile: vi.fn(),
}))

// Mock de las funciones de firebase/firestore
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  setDoc: vi.fn(),
  getDoc: vi.fn(() => Promise.resolve({ exists: () => false, data: () => null })),
  getDocs: vi.fn(),
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  Timestamp: {
    now: vi.fn(() => ({ toDate: () => new Date() })),
  },
}))