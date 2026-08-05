import { collection, addDoc, getDocs, deleteDoc, doc as firestoreDoc, Timestamp } from 'firebase/firestore'
import { db } from '../services/firebase'
import type { ProductCategory } from '../types'

interface SeedProduct {
  name: string
  description: string
  price: number
  stock: number
  category: ProductCategory
  imageUrl: string
  featured: boolean
}

// Los primeros 6 son los que ya veníamos usando como "featured" (Destacados).
// Los últimos 6 son nuevos, pensados para poblar la sección de Novedades
// (que se arma por fecha de creación, no necesitan featured: true).
const products: SeedProduct[] = [
  {
    name: 'Botas de Trekking Impermeables',
    description: 'Botas con membrana impermeable, ideales para terrenos exigentes.',
    price: 72000,
    stock: 8,
    category: 'trekking',
    imageUrl: 'https://placehold.co/400x300?text=Botas+Trekking',
    featured: true,
  },
  {
    name: 'Bastones de Trekking Ajustables',
    description: 'Par de bastones telescópicos de aluminio, livianos y resistentes.',
    price: 28000,
    stock: 15,
    category: 'trekking',
    imageUrl: 'https://placehold.co/400x300?text=Bastones',
    featured: true,
  },
  {
    name: 'Campera Softshell',
    description: 'Campera cortavientos e hidrorrepelente para uso en montaña.',
    price: 58000,
    stock: 10,
    category: 'indumentaria',
    imageUrl: 'https://placehold.co/400x300?text=Softshell',
    featured: true,
  },
  {
    name: 'Cocina Portátil a Gas',
    description: 'Anafe compacto para camping, con encendido automático.',
    price: 34000,
    stock: 12,
    category: 'camping',
    imageUrl: 'https://placehold.co/400x300?text=Cocina+Gas',
    featured: true,
  },
  {
    name: 'Power Bank Solar 20000mAh',
    description: 'Batería portátil con carga solar, ideal para salidas largas.',
    price: 45000,
    stock: 9,
    category: 'tecnologia',
    imageUrl: 'https://placehold.co/400x300?text=Power+Bank',
    featured: true,
  },
  {
    name: 'Cantimplora Térmica 1L',
    description: 'Mantiene la temperatura del líquido hasta 12 horas.',
    price: 16000,
    stock: 20,
    category: 'accesorios',
    imageUrl: 'https://placehold.co/400x300?text=Cantimplora',
    featured: true,
  },
  {
    name: 'Anteojos de Sol Polarizados',
    description: 'Protección UV400, ideales para nieve y altura.',
    price: 22000,
    stock: 14,
    category: 'accesorios',
    imageUrl: 'https://placehold.co/400x300?text=Anteojos',
    featured: false,
  },
  {
    name: 'Guantes Térmicos',
    description: 'Guantes impermeables con forro polar, para bajas temperaturas.',
    price: 14000,
    stock: 18,
    category: 'indumentaria',
    imageUrl: 'https://placehold.co/400x300?text=Guantes',
    featured: false,
  },
  {
    name: 'Colchoneta Inflable',
    description: 'Colchoneta autoinflable, compacta para transportar.',
    price: 38000,
    stock: 11,
    category: 'camping',
    imageUrl: 'https://placehold.co/400x300?text=Colchoneta',
    featured: false,
  },
  {
    name: 'Brújula de Precisión',
    description: 'Brújula analógica con clinómetro, resistente al agua.',
    price: 9000,
    stock: 25,
    category: 'accesorios',
    imageUrl: 'https://placehold.co/400x300?text=Brujula',
    featured: false,
  },
  {
    name: 'Auriculares Deportivos Bluetooth',
    description: 'Resistentes al sudor y la lluvia, con 20hs de batería.',
    price: 52000,
    stock: 7,
    category: 'tecnologia',
    imageUrl: 'https://placehold.co/400x300?text=Auriculares',
    featured: false,
  },
  {
    name: 'Pantalón Cargo Trekking',
    description: 'Pantalón de secado rápido con bolsillos reforzados.',
    price: 41000,
    stock: 13,
    category: 'indumentaria',
    imageUrl: 'https://placehold.co/400x300?text=Pantalon+Cargo',
    featured: false,
  },
  {
    name: 'Piolet de Alpinismo',
    description: 'Piolet técnico de aluminio, para hielo y nieve dura.',
    price: 48000,
    stock: 10,
    category: 'trekking',
    imageUrl: 'https://placehold.co/400x300?text=Piolet',
    featured: true,
  },
  {
    name: 'Hornillo a Gas Ultraliviano',
    description: 'Hornillo compacto, plegable, ideal para trekkings largos.',
    price: 26000,
    stock: 16,
    category: 'camping',
    imageUrl: 'https://placehold.co/400x300?text=Hornillo',
    featured: true,
  },
  {
    name: 'Buff Térmico Multifunción',
    description: 'Cubrecuello de microfibra, protege del viento y el frío.',
    price: 8000,
    stock: 30,
    category: 'indumentaria',
    imageUrl: 'https://placehold.co/400x300?text=Buff+Termico',
    featured: true,
  },
  {
    name: 'GPS Portátil para Montaña',
    description: 'Navegador GPS resistente al agua, con mapas topográficos.',
    price: 95000,
    stock: 6,
    category: 'tecnologia',
    imageUrl: 'https://placehold.co/400x300?text=GPS+Portatil',
    featured: true,
  },
  {
    name: 'Silla Plegable de Camping',
    description: 'Silla liviana con funda, soporta hasta 120kg.',
    price: 31000,
    stock: 14,
    category: 'camping',
    imageUrl: 'https://placehold.co/400x300?text=Silla+Camping',
    featured: true,
  },
  {
    name: 'Mosquetero de Aluminio x3',
    description: 'Set de 3 mosquetones livianos, para uso general en montaña.',
    price: 12000,
    stock: 22,
    category: 'accesorios',
    imageUrl: 'https://placehold.co/400x300?text=Mosquetones',
    featured: true,
  },
]

export const seedProducts = async (): Promise<{ created: number; skipped: number }> => {
  const existingSnapshot = await getDocs(collection(db, 'products'))
  const existingNames = new Set(
    existingSnapshot.docs.map(doc => (doc.data().name as string)?.toLowerCase())
  )

  let created = 0
  let skipped = 0

  for (const product of products) {
    if (existingNames.has(product.name.toLowerCase())) {
      console.log(`Ya existe, salteado: ${product.name}`)
      skipped++
      continue
    }
    await addDoc(collection(db, 'products'), {
      ...product,
      nameLower: product.name.toLowerCase(),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    console.log(`Producto agregado: ${product.name}`)
    created++
  }

  console.log(`Listo: ${created} creados, ${skipped} ya existían.`)
  return { created, skipped }
}

// Función temporal de limpieza: si por algún motivo quedaron productos
// duplicados (mismo nombre, varios documentos), borra los sobrantes y deja
// solo el más antiguo de cada nombre. Usar una vez y sacar el botón después.
export const removeDuplicateProducts = async (): Promise<{ removed: number }> => {
  const snapshot = await getDocs(collection(db, 'products'))
  const byName = new Map<string, { id: string; createdAt: number }[]>()

  snapshot.docs.forEach(docSnap => {
    const data = docSnap.data()
    const name = (data.name as string)?.toLowerCase()
    if (!name) return
    const createdAt = data.createdAt?.toMillis ? data.createdAt.toMillis() : 0
    const list = byName.get(name) ?? []
    list.push({ id: docSnap.id, createdAt })
    byName.set(name, list)
  })

  let removed = 0
  for (const [, docs] of byName) {
    if (docs.length <= 1) continue
    // Ordenamos por fecha de creación y nos quedamos con el más antiguo
    docs.sort((a, b) => a.createdAt - b.createdAt)
    const toRemove = docs.slice(1)
    for (const doc of toRemove) {
      await deleteDoc(firestoreDoc(db, 'products', doc.id))
      removed++
    }
  }

  return { removed }
}