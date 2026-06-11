import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc, 
  query, 
  where,
  updateDoc,
  Timestamp,
  orderBy
} from 'firebase/firestore'
import { db } from './firebase'
import type { Order, CreateOrderDTO, OrderStatus } from '../types'

// Crear una orden nueva
export const createOrder = async (orderData: CreateOrderDTO): Promise<string> => {
  const docRef = await addDoc(collection(db, 'orders'), {
    ...orderData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
  return docRef.id
}

// Obtener órdenes de un usuario específico
export const getOrdersByUser = async (userId: string): Promise<Order[]> => {
  const q = query(
    collection(db, 'orders'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  })) as Order[]
}

// Obtener todas las órdenes (solo admin)
export const getAllOrders = async (): Promise<Order[]> => {
  const q = query(
    collection(db, 'orders'),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  })) as Order[]
}

// Obtener una orden por ID
export const getOrderById = async (id: string): Promise<Order | null> => {
  const docRef = doc(db, 'orders', id)
  const snapshot = await getDoc(docRef)
  if (!snapshot.exists()) return null
  return {
    id: snapshot.id,
    ...snapshot.data(),
    createdAt: snapshot.data().createdAt?.toDate(),
    updatedAt: snapshot.data().updatedAt?.toDate(),
  } as Order
}

// Actualizar el estado de una orden (solo admin)
export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<void> => {
  const docRef = doc(db, 'orders', orderId)
  await updateDoc(docRef, { 
    status,
    updatedAt: Timestamp.now()
  })
}