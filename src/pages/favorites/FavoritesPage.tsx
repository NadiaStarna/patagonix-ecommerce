import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Heart } from 'lucide-react'
import { useFavorites } from '../../contexts/favorites'
import { getProductById } from '../../services/products.service'
import { ProductCard } from '../../components/common/ProductCard'
import { LoadingState } from '../../components/common/LoadingState'
import { EmptyState } from '../../components/common/EmptyState'
import type { Product } from '../../types'
import { ROUTES } from '../../routes/routes'

type Filter = 'todos' | 'sin-stock'

export const FavoritesPage = () => {
  const navigate = useNavigate()
  const { favoriteIds, loading: favoritesLoading } = useFavorites()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('todos')

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

  const outOfStockCount = products.filter(p => p.stock === 0).length
  const visibleProducts = filter === 'sin-stock' ? products.filter(p => p.stock === 0) : products

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-1 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-stone">Mis favoritos</h1>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-500 border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={15} />
          Atrás
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-5">Productos que guardaste para después.</p>

      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setFilter('todos')}
          className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
            filter === 'todos' ? 'bg-stone text-white border-stone' : 'bg-white text-stone border-gray-200 hover:bg-fog'
          }`}
        >
          Todos ({products.length})
        </button>
        {outOfStockCount > 0 && (
          <button
            onClick={() => setFilter('sin-stock')}
            className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
              filter === 'sin-stock' ? 'bg-stone text-white border-stone' : 'bg-white text-stone border-gray-200 hover:bg-fog'
            }`}
          >
            Sin stock ({outOfStockCount})
          </button>
        )}
      </div>

      {visibleProducts.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-16">No hay favoritos con ese filtro.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {visibleProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Banner final */}
      <div className="mt-10 bg-fog rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
            <Heart size={18} className="text-sunset" />
          </span>
          <div>
            <p className="font-semibold text-stone text-sm">¿Ves algo que te gusta?</p>
            <p className="text-xs text-gray-500">Los productos en favoritos no se reservan — no te quedes sin el tuyo.</p>
          </div>
        </div>
        <Link
          to={ROUTES.PRODUCTS}
          state={{ scrollToCatalog: true }}
          className="flex items-center gap-1.5 bg-stone text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-90 transition whitespace-nowrap"
        >
          Explorar catálogo
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  )
}