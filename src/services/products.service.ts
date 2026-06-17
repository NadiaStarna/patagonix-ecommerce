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
  serverTimestamp,
  orderBy,
  startAfter,
  startAt,
  endAt,
  limit,
  type QueryDocumentSnapshot,
} from 'firebase/firestore'
import { db } from './firebase'
import { productConverter } from './converters/productConverter'
import type { Product, ProductCategory, CreateProductDTO, UpdateProductDTO } from '../types'

const productsRef = collection(db, 'products').withConverter(productConverter)

const PAGE_SIZE = 12

export interface GetProductsParams {
  category?: ProductCategory | 'todas'
  searchPrefix?: string
  cursor?: QueryDocumentSnapshot<Product> | null
}

export interface GetProductsResult {
  products: Product[]
  lastDoc: QueryDocumentSnapshot<Product> | null
  hasMore: boolean
}

// Obtener productos paginados, con filtro de categoría y búsqueda por prefijo opcionales.
// Reemplaza a getProducts/getProductsByCategory anteriores, unificando la lógica
// en una sola función que arma la query según los parámetros recibidos.
export const getProductsPage = async (params: GetProductsParams = {}): Promise<GetProductsResult> => {
  const { category, searchPrefix, cursor } = params

  const constraints = []

  if (category && category !== 'todas') {
    constraints.push(where('category', '==', category))
  }

  // La búsqueda por prefijo requiere ordenar por el mismo campo que se rangea
  // (nameLower), por eso siempre va orderBy + startAt/endAt juntos
  if (searchPrefix && searchPrefix.trim().length > 0) {
    const prefix = searchPrefix.trim().toLowerCase()
    constraints.push(orderBy('nameLower'))
    constraints.push(startAt(prefix))
    constraints.push(endAt(prefix + '\uf8ff'))
  } else {
    constraints.push(orderBy('createdAt', 'desc'))
  }

  if (cursor) {
    constraints.push(startAfter(cursor))
  }

  constraints.push(limit(PAGE_SIZE))

  const q = query(productsRef, ...constraints)
  const snapshot = await getDocs(q)

  const products = snapshot.docs.map(doc => doc.data())
  const lastDoc = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null

  // Si llegaron menos productos que el tamaño de página, no hay más para cargar
  const hasMore = snapshot.docs.length === PAGE_SIZE

  return { products, lastDoc, hasMore }
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
    nameLower: productData.name.toLowerCase(),
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
    ...(productData.name ? { nameLower: productData.name.toLowerCase() } : {}),
    updatedAt: serverTimestamp(),
  })
}

// Eliminar un producto
export const deleteProduct = async (id: string): Promise<void> => {
  await deleteDoc(doc(productsRef, id))
}

// Mantenemos esta función para el admin, que sigue necesitando la lista completa sin paginar
export const getProducts = async (): Promise<Product[]> => {
  const snapshot = await getDocs(productsRef)
  return snapshot.docs.map(doc => doc.data())
}