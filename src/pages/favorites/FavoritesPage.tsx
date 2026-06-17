import { useEffect, useState } from 'react'
import { useFavorites } from '../../contexts/favorites'
import { getProductById } from '../../services/products.service'
import { ProductCard } from '../../components/common/ProductCard'
import { LoadingState } from '../../components/common/LoadingState'
import { EmptyState } from '../../components/common/EmptyState'
import type { Product } from '../../types'

export const FavoritesPage = () => {
  const { favoriteIds, loading: favoritesLoading } = useFavorites()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Si todavía estamos esperando la lista de IDs favoritos, no hacemos nada
    if (favoritesLoading) return

    if (favoriteIds.length === 0) {
      setProducts([])
      setLoading(false)
      return
    }

    setLoading(true)
    // Traemos cada producto favorito por su ID. Si alguno fue eliminado
    // del catálogo, getProductById devuelve null y lo filtramos
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
      <EmptyState
        icon="♡"
        title="Todavía no tenés favoritos"
        description="Marcá productos con el corazón para encontrarlos rápido acá"
      />
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">Mis favoritos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}