import { doc, getDoc, collection, getDocs } from 'firebase/firestore'
import { db } from './firebase'
import type { AppUser } from '../types'

const mapUserDoc = (id: string, data: any): AppUser => ({
  uid: id,
  email: data.email ?? '',
  displayName: data.displayName ?? '',
  role: data.role ?? 'customer',
  createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
})

// Trae el displayName de un usuario por su uid. Se usa para mostrar
// "quién hizo el pedido" en Pedidos/Dashboard, ya que Order solo guarda userId.
export const getUserById = async (uid: string): Promise<AppUser | null> => {
  const snapshot = await getDoc(doc(db, 'users', uid))
  if (!snapshot.exists()) return null
  return mapUserDoc(snapshot.id, snapshot.data())
}

// Trae varios usuarios de una — evita N llamadas sueltas cuando hay varios
// pedidos de distintos clientes en la misma pantalla.
export const getUsersByIds = async (uids: string[]): Promise<Map<string, AppUser>> => {
  const uniqueIds = [...new Set(uids)]
  const results = await Promise.all(uniqueIds.map(uid => getUserById(uid)))
  const map = new Map<string, AppUser>()
  results.forEach((user, idx) => {
    if (user) map.set(uniqueIds[idx], user)
  })
  return map
}

// Trae todos los usuarios registrados (solo admin, según las reglas de Firestore)
export const getAllUsers = async (): Promise<AppUser[]> => {
  const snapshot = await getDocs(collection(db, 'users'))
  return snapshot.docs.map(d => mapUserDoc(d.id, d.data()))
}