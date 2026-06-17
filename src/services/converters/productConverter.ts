import type {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  DocumentData,
  WithFieldValue,
} from 'firebase/firestore'
import { Timestamp } from 'firebase/firestore'
import type { Product, ProductCategory } from '../../types'

export const productConverter: FirestoreDataConverter<Product> = {
  toFirestore(product: WithFieldValue<Product>): DocumentData {
    return {
      name: product.name,
      nameLower: product.nameLower,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      imageUrl: product.imageUrl,
    }
  },

  fromFirestore(snapshot: QueryDocumentSnapshot): Product {
    const data = snapshot.data()

    if (
      typeof data.name !== 'string' ||
      typeof data.description !== 'string' ||
      typeof data.price !== 'number' ||
      typeof data.stock !== 'number' ||
      typeof data.category !== 'string'
    ) {
      throw new Error(`[productConverter] Documento inválido o incompleto, id: ${snapshot.id}`)
    }

    return {
      id: snapshot.id,
      name: data.name,
      // Si un documento viejo no tiene nameLower todavía, lo calculamos al vuelo
      // como fallback, para no romper productos creados antes de este cambio
      nameLower: typeof data.nameLower === 'string' ? data.nameLower : data.name.toLowerCase(),
      description: data.description,
      price: data.price,
      stock: data.stock,
      category: data.category as ProductCategory,
      imageUrl: data.imageUrl ?? '',
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),
    }
  },
}