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

const PAGE_SIZE = 8

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

export const getProductsPage = async (params: GetProductsParams = {}): Promise<GetProductsResult> => {
  const { category, searchPrefix, cursor } = params

  const constraints = []

  if (category && category !== 'todas') {
    constraints.push(where('category', '==', category))
  }

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

  constraints.push(limit(PAGE_SIZE))  //PAGE_SIZE = 8

  const q = query(productsRef, ...constraints)
  const snapshot = await getDocs(q)

  const products = snapshot.docs.map(doc => doc.data())
  const lastDoc = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null

  const hasMore = snapshot.docs.length === PAGE_SIZE

  return { products, lastDoc, hasMore }
}

export const getProductById = async (id: string): Promise<Product | null> => {
  const docRef = doc(productsRef, id)
  const snapshot = await getDoc(docRef)
  if (!snapshot.exists()) return null
  return snapshot.data()
}

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

export const updateProduct = async (id: string, productData: UpdateProductDTO): Promise<void> => {
  const docRef = doc(productsRef, id)
  await updateDoc(docRef, {
    ...productData,
    ...(productData.name ? { nameLower: productData.name.toLowerCase() } : {}),
    updatedAt: serverTimestamp(),
  })
}

export const deleteProduct = async (id: string): Promise<void> => {
  await deleteDoc(doc(productsRef, id))
}

export const getProducts = async (): Promise<Product[]> => {
  const snapshot = await getDocs(productsRef)
  return snapshot.docs.map(doc => doc.data())
}