import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useFavorites } from '../../contexts/favorites'
import { getProductById } from '../../services/products.service'
import { ProductCard } from '../../components/common/ProductCard'
import { LoadingState } from '../../components/common/LoadingState'
import { EmptyState } from '../../components/common/EmptyState'
import type { Product } from '../../types'
import { ROUTES } from '../../routes/routes'

export const FavoritesPage = () => {
  const { favoriteIds, loading: favoritesLoading } = useFavorites()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (favoritesLoading) return

    if (favoriteIds.length === 0) {
      setProducts([])
      setLoading(false)
      return
    }

    setLoading(true)
    Promise.all(favoriteIds.map(id => getProductById(id)))
      .then(results => {
        const validProducts = results.filter((p): p is Product => p !== null)
        setProducts(validProducts)
      })
      .finally(() => setLoading(false))
  }, [favoriteIds, favoritesLoading])

  if (favoritesLoading || loading) {
    return <LoadingState message="Cargando tus favoritos..." />
  }

  if (products.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center text-gray-400">
        <EmptyState
          icon="♡"
          title="Todavía no tenés favoritos"
          description="Marcá productos con el corazón para encontrarlos rápido."
        />
        <Link
          to={ROUTES.PRODUCTS}
          state={{ scrollToCatalog: true }}
          className="mt-2 bg-stone text-white px-6 py-2 rounded-lg text-sm hover:bg-opacity-90 transition md:hidden"
        >
          Ver productos
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-stone mb-6">Mis favoritos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}