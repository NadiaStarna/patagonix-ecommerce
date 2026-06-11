import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  Timestamp 
} from 'firebase/firestore'
import { db } from './firebase'
import type { Product, ProductCategory, CreateProductDTO, UpdateProductDTO } from '../types'

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

// Crear un producto nuevo
export const createProduct = async (productData: CreateProductDTO): Promise<string> => {
  const docRef = await addDoc(collection(db, 'products'), {
    ...productData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
  return docRef.id
}

// Actualizar un producto
export const updateProduct = async (id: string, productData: UpdateProductDTO): Promise<void> => {
  const docRef = doc(db, 'products', id)
  await updateDoc(docRef, {
    ...productData,
    updatedAt: Timestamp.now(),
  })
}

// Eliminar un producto
export const deleteProduct = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'products', id))
}