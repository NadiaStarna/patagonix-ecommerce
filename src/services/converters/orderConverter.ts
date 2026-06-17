import type {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  DocumentData,
  WithFieldValue,
} from 'firebase/firestore'
import { Timestamp } from 'firebase/firestore'
import type { Order, OrderStatus } from '../../types'

export const orderConverter: FirestoreDataConverter<Order> = {
  toFirestore(order: WithFieldValue<Order>): DocumentData {
    return {
      userId: order.userId,
      items: order.items,
      total: order.total,
      status: order.status,
    }
  },

  fromFirestore(snapshot: QueryDocumentSnapshot): Order {
    const data = snapshot.data()

    if (
      typeof data.userId !== 'string' ||
      !Array.isArray(data.items) ||
      data.items.length === 0 ||
      typeof data.total !== 'number'
    ) {
      throw new Error(`[orderConverter] Documento inválido o incompleto, id: ${snapshot.id}`)
    }

    return {
      id: snapshot.id,
      userId: data.userId,
      items: data.items,
      total: data.total,
      status: (data.status ?? 'pending') as OrderStatus,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),
    }
  },
}