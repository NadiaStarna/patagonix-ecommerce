import { 
  collection, 
  getDocs, 
  getDoc,
  doc, 
  query, 
  where,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  orderBy,
  runTransaction,
} from 'firebase/firestore'
import { db } from './firebase'
import { orderConverter } from './converters/orderConverter'
import type { Order, CreateOrderDTO, OrderStatus } from '../types'

const ordersRef = collection(db, 'orders').withConverter(orderConverter)
const orderCounterRef = doc(db, 'counters', 'orders')

const START_NUMBER = 1000

// Crear una orden nueva. Todo pasa dentro de una única transacción atómica:
// 1) se asigna el número de pedido (contador en counters/orders, nunca se repite)
// 2) se valida y descuenta el stock de cada producto comprado
// Si algún producto no tiene stock suficiente, no se crea nada — ni la orden
// ni se toca el stock de los demás productos del carrito.
export const createOrder = async (orderData: CreateOrderDTO): Promise<string> => {
  const newOrderRef = doc(ordersRef)

  await runTransaction(db, async transaction => {
    // --- Lecturas primero (Firestore exige leer todo antes de escribir) ---
    const counterSnap = await transaction.get(orderCounterRef)

    const productRefs = orderData.items.map(item => doc(db, 'products', item.productId))
    const productSnaps = await Promise.all(productRefs.map(ref => transaction.get(ref)))

    productSnaps.forEach((snap, i) => {
      const item = orderData.items[i]
      if (!snap.exists()) {
        throw new Error(`El producto "${item.name}" ya no existe.`)
      }
      const currentStock = snap.data().stock as number
      if (currentStock < item.quantity) {
        throw new Error(`Sin stock suficiente de "${item.name}" (quedan ${currentStock}).`)
      }
    })

    // --- Escrituras ---
    const lastNumber = counterSnap.exists() ? (counterSnap.data().lastNumber as number) : START_NUMBER
    const nextNumber = lastNumber + 1
    transaction.set(orderCounterRef, { lastNumber: nextNumber })

    productSnaps.forEach((snap, i) => {
      const item = orderData.items[i]
      const currentStock = snap.data()!.stock as number
      transaction.update(productRefs[i], {
        stock: currentStock - item.quantity,
        updatedAt: serverTimestamp(),
      })
    })

    transaction.set(newOrderRef, {
      ...orderData,
      orderNumber: nextNumber,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    } as any)
  })

  return newOrderRef.id
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