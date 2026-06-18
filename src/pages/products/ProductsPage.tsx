import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useProducts } from '../../contexts/products'
import { ProductCard } from '../../components/common/ProductCard'
import { Hero } from '../../components/common/Hero'
import { LoadingState } from '../../components/common/LoadingState'
import { EmptyState } from '../../components/common/EmptyState'
import { ErrorState } from '../../components/common/ErrorState'
import type { ProductCategory } from '../../types'

const CATEGORIES: { label: string; value: ProductCategory | 'todas' }[] = [
  { label: 'Todas', value: 'todas' },
  { label: 'Electrónica', value: 'electronica' },
  { label: 'Ropa', value: 'ropa' },
  { label: 'Hogar', value: 'hogar' },
  { label: 'Deportes', value: 'deportes' },
  { label: 'Otros', value: 'otros' },
]

export const ProductsPage = () => {
  const location = useLocation()
  const {
    products,
    loading,
    loadingMore,
    hasMore,
    error,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    refetchProducts,
    loadMore,
  } = useProducts()

  useEffect(() => {
    const scrollToCatalog = (location.state as { scrollToCatalog?: boolean } | null)?.scrollToCatalog
    if (scrollToCatalog) {
      document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [location.state])

  return (
    <div>
      <Hero />

      <div id="catalogo" className="max-w-7xl mx-auto px-4 py-8">

        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar productos..."
            className="w-full border border-gray-300 bg-white text-stone rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-glacier"
          />
        </div>

        <div className="flex justify-start gap-2 flex-wrap mb-6">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                selectedCategory === cat.value
                  ? 'bg-stone text-white'
                  : 'bg-white text-stone border border-stone hover:bg-stone hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {loading && <LoadingState message="Cargando productos..." />}

        {error && <ErrorState message={error} onRetry={refetchProducts} />}

        {!loading && !error && products.length === 0 && (
          <EmptyState
            icon="🔍"
            title="No se encontraron productos"
            description="Probá con otra categoría o término de búsqueda"
          />
        )}

        {!loading && products.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product: typeof products[number]) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="bg-white border border-stone text-stone px-6 py-2 rounded-lg text-sm font-medium hover:bg-stone hover:text-white transition disabled:opacity-50"
                >
                  {loadingMore ? 'Cargando más...' : 'Cargar más productos'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}