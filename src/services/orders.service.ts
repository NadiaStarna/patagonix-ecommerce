import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc, 
  query, 
  where,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  orderBy
} from 'firebase/firestore'
import { db } from './firebase'
import { orderConverter } from './converters/orderConverter'
import type { Order, CreateOrderDTO, OrderStatus } from '../types'

const ordersRef = collection(db, 'orders').withConverter(orderConverter)

// Crear una orden nueva
export const createOrder = async (orderData: CreateOrderDTO): Promise<string> => {
  const docRef = await addDoc(ordersRef, {
    ...orderData,
    id: '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  } as any)
  return docRef.id
}

// Obtener órdenes de un usuario específico
export const getOrdersByUser = async (userId: string): Promise<Order[]> => {
  const q = query(
    ordersRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => doc.data())
}

// Obtener todas las órdenes (solo admin)
export const getAllOrders = async (): Promise<Order[]> => {
  const q = query(ordersRef, orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => doc.data())
}

// Obtener una orden por ID
export const getOrderById = async (id: string): Promise<Order | null> => {
  const docRef = doc(ordersRef, id)
  const snapshot = await getDoc(docRef)
  if (!snapshot.exists()) return null
  return snapshot.data()
}

// Actualizar el estado de una orden (solo admin)
export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<void> => {
  const docRef = doc(ordersRef, orderId)
  await updateDoc(docRef, { 
    status,
    updatedAt: serverTimestamp()
  })
}

// Eliminar una orden (solo admin)
export const deleteOrder = async (orderId: string): Promise<void> => {
  await deleteDoc(doc(ordersRef, orderId))
}