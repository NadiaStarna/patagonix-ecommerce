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
  serverTimestamp 
} from 'firebase/firestore'
import { db } from './firebase'
import { productConverter } from './converters/productConverter'
import type { Product, ProductCategory, CreateProductDTO, UpdateProductDTO } from '../types'

// La referencia a la colección lleva el converter aplicado UNA sola vez.
// A partir de acá, cualquier operación sobre productsRef ya devuelve
// y espera objetos Product tipados y validados, nunca datos crudos del SDK.
const productsRef = collection(db, 'products').withConverter(productConverter)

// Obtener todos los productos
export const getProducts = async (): Promise<Product[]> => {
  const snapshot = await getDocs(productsRef)
  return snapshot.docs.map(doc => doc.data())
}

// Obtener productos por categoría
export const getProductsByCategory = async (category: ProductCategory): Promise<Product[]> => {
  const q = query(productsRef, where('category', '==', category))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => doc.data())
}

// Obtener un producto por ID
export const getProductById = async (id: string): Promise<Product | null> => {
  const docRef = doc(productsRef, id)
  const snapshot = await getDoc(docRef)
  if (!snapshot.exists()) return null
  return snapshot.data()
}

// Crear un producto nuevo
export const createProduct = async (productData: CreateProductDTO): Promise<string> => {
  const docRef = await addDoc(productsRef, {
    ...productData,
    id: '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  } as any)
  return docRef.id
}

// Actualizar un producto
export const updateProduct = async (id: string, productData: UpdateProductDTO): Promise<void> => {
  const docRef = doc(productsRef, id)
  await updateDoc(docRef, {
    ...productData,
    updatedAt: serverTimestamp(),
  })
}

// Eliminar un producto
export const deleteProduct = async (id: string): Promise<void> => {
  await deleteDoc(doc(productsRef, id))
}