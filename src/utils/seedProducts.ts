import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { db } from '../services/firebase'

const products = [
  {
    name: 'Remera Básica',
    description: 'Remera de algodón premium',
    price: 5000,
    stock: 50,
    category: 'ropa',
    imageUrl: 'https://placehold.co/400x300?text=Remera',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    name: 'Silla Ergonómica',
    description: 'Silla de oficina con soporte lumbar',
    price: 80000,
    stock: 5,
    category: 'hogar',
    imageUrl: 'https://placehold.co/400x300?text=Silla',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    name: 'Zapatillas Running',
    description: 'Zapatillas deportivas para correr',
    price: 35000,
    stock: 20,
    category: 'deportes',
    imageUrl: 'https://placehold.co/400x300?text=Zapatillas',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
]

export const seedProducts = async () => {
  for (const product of products) {
    await addDoc(collection(db, 'products'), product)
    console.log(`Producto agregado: ${product.name}`)
  }
  console.log('¡Todos los productos fueron cargados!')
}