import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from './firebase'
import type { FavoritesDoc } from '../types'

// Un solo documento por usuario, identificado por su uid.
// Esto evita queries: leer los favoritos de un usuario es una
// operación directa por ID, igual que leer su perfil en users/{uid}
const getFavoritesRef = (uid: string) => doc(db, 'favorites', uid)

// Obtiene los IDs de productos favoritos de un usuario.
// Si el usuario nunca marcó nada como favorito, el documento no existe
// todavía, así que devolvemos un array vacío en lugar de null
export const getFavorites = async (uid: string): Promise<string[]> => {
  const snapshot = await getDoc(getFavoritesRef(uid))
  if (!snapshot.exists()) return []
  const data = snapshot.data() as FavoritesDoc
  return data.productIds ?? []
}

// Sobreescribe el array completo de favoritos del usuario.
// Usamos setDoc en lugar de updateDoc porque el documento puede no
// existir todavía la primera vez que el usuario marca un favorito
export const setFavorites = async (uid: string, productIds: string[]): Promise<void> => {
  await setDoc(getFavoritesRef(uid), { productIds })
}