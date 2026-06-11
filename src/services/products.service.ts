import { collection, getDocs, getDoc, doc, query, where } from 'firebase/firestore'
import { db } from './firebase'
import type { Product, ProductCategory } from '../types'

// Obtener todos los productos
export const getProducts = async (): Promise<Product[]> => {
  const snapshot = await getDocs(collection(db, 'products'))
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  })) as Product[]
}

// Obtener productos por categoría
export const getProductsByCategory = async (category: ProductCategory): Promise<Product[]> => {
  const q = query(collection(db, 'products'), where('category', '==', category))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  })) as Product[]
}

// Obtener un producto por ID
export const getProductById = async (id: string): Promise<Product | null> => {
  const docRef = doc(db, 'products', id)
  const snapshot = await getDoc(docRef)
  if (!snapshot.exists()) return null
  return {
    id: snapshot.id,
    ...snapshot.data(),
    createdAt: snapshot.data().createdAt?.toDate(),
    updatedAt: snapshot.data().updatedAt?.toDate(),
  } as Product
}