import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mountain, Tent, Backpack, Shirt, Cpu } from 'lucide-react'
import { getProducts } from '../../services/products.service'
import { ROUTES } from '../../routes/routes'
import type { Product, ProductCategory } from '../../types'
import { useProducts } from '../../contexts/products'

const COLLECTIONS: { value: ProductCategory; label: string; description: string; icon: typeof Mountain; size: 'lg' | 'sm' }[] = [
  { value: 'trekking', label: 'Trekking', description: 'Equipamiento para altas cumbres', icon: Mountain, size: 'lg' },
  { value: 'camping', label: 'Camping', description: 'Todo lo que necesitás para tu campamento', icon: Tent, size: 'lg' },
  { value: 'indumentaria', label: 'Ropa térmica', description: 'Abrigate con tecnología de última generación', icon: Shirt, size: 'sm' },
  { value: 'accesorios', label: 'Accesorios', description: 'Detalles que hacen la diferencia', icon: Backpack, size: 'sm' },
  { value: 'tecnologia', label: 'Tecnología', description: 'Gadgets para tu próxima aventura', icon: Cpu, size: 'sm' },
]

export const LandingCollections = () => {
  const navigate = useNavigate()
  const { setSelectedCategory } = useProducts()
  const [productByCategory, setProductByCategory] = useState<Record<string, Product>>({})

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const all = await getProducts()
        const map: Record<string, Product> = {}
        all.forEach(p => {
          if (!map[p.category]) map[p.category] = p
        })
        setProductByCategory(map)
      } catch {
        setProductByCategory({})
      }
    }
    fetchProducts()
  }, [])

  const goToCollection = (category: ProductCategory) => {
    setSelectedCategory(category)
    navigate(ROUTES.PRODUCTS, { state: { scrollToCatalog: true } })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-14">
      <span className="text-sunset text-xs font-semibold tracking-widest uppercase">Colecciones</span>
      <h2 className="text-2xl md:text-3xl font-bold text-stone mt-1 mb-6" style={{ fontFamily: 'var(--font-display)' }}>
        Elegí tu próxima aventura
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {COLLECTIONS.filter(c => c.size === 'lg').map(col => {
          const product = productByCategory[col.value]
          return (
            <button
              key={col.value}
              onClick={() => goToCollection(col.value)}
              className="relative rounded-2xl overflow-hidden h-56 text-left group"
            >
              {product ? (
                <img
                  src={product.imageUrl}
                  alt={col.label}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="absolute inset-0 bg-navy" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent" />
              <div className="relative h-full flex flex-col justify-end p-5 text-white">
                <col.icon size={20} className="mb-2 text-sunset" />
                <h3 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>{col.label}</h3>
                <p className="text-xs text-gray-200 mb-3">{col.description}</p>
                <span className="inline-block w-fit bg-sunset text-white text-xs font-semibold px-3 py-1.5 rounded-lg">
                  Explorar
                </span>
              </div>
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {COLLECTIONS.filter(c => c.size === 'sm').map(col => {
          const product = productByCategory[col.value]
          return (
            <button
              key={col.value}
              onClick={() => goToCollection(col.value)}
              className="relative rounded-2xl overflow-hidden h-40 text-left group"
            >
              {product ? (
                <img
                  src={product.imageUrl}
                  alt={col.label}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="absolute inset-0 bg-navy" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent" />
              <div className="relative h-full flex flex-col justify-end p-4 text-white">
                <col.icon size={16} className="mb-1.5 text-sunset" />
                <h3 className="text-sm font-bold">{col.label}</h3>
                <p className="text-[11px] text-gray-300 mb-2 line-clamp-1">{col.description}</p>
                <span className="inline-block w-fit bg-sunset text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg">
                  Explorar
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}