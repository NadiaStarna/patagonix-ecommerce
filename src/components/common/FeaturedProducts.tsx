import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import { getFeaturedProducts } from '../../services/products.service'
import { ProductCard } from './ProductCard'
import { ROUTES } from '../../routes/routes'
import type { Product } from '../../types'

export const FeaturedProducts = () => {
  const [destacados, setDestacados] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const featured = await getFeaturedProducts()
        setDestacados(featured)
      } catch {
        setDestacados([])
      } finally {
        setLoading(false)
      }
    }
    fetchFeatured()
  }, [])

  if (!loading && destacados.length === 0) return null

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-1.5 bg-navy text-white text-xs font-medium px-3 py-1.5 rounded-md">
          <Star size={12} />
          Destacados
        </div>
        <Link to={ROUTES.PRODUCTS} className="flex items-center gap-1 text-xs text-glacier hover:underline whitespace-nowrap">
          Ver todos los productos →
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Cargando...</p>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {destacados.map(product => (
            <ProductCard key={product.id} product={product} featured compact />
          ))}
        </div>
      )}
    </div>
  )
}