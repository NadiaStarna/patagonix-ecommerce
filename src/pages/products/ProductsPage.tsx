// src/pages/products/ProductsPage.tsx
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useProducts } from '../../contexts/products'
import { ProductCard } from '../../components/common/ProductCard'
import { Hero } from '../../components/common/Hero'
import { EmptyState } from '../../components/common/EmptyState'
import { ErrorState } from '../../components/common/ErrorState'
import { Search } from 'lucide-react'
import type { ProductCategory } from '../../types'

const CATEGORIES: { label: string; value: ProductCategory | 'todas' }[] = [
  { label: 'Todas', value: 'todas' },
  { label: 'Trekking', value: 'trekking' },
  { label: 'Indumentaria', value: 'indumentaria' },
  { label: 'Tecnología', value: 'tecnologia' },
  { label: 'Camping', value: 'camping' },
  { label: 'Accesorios', value: 'accesorios' },
]

export const ProductsPage = () => {
  const location = useLocation()
  const {
    products,
    loading,
    searching,
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

  // Mientras Firestore carga, mostramos solo el spinner
  if (loading && !searching) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-3 bg-fog z-50">
        <div className="w-10 h-10 border-4 border-glacier border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400">Cargando productos...</p>
      </div>
    )
  }

  return (
    <div>
      <Hero />

      <div id="catalogo" className="max-w-7xl mx-auto px-4 py-8">

        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar productos..."
              className="w-full border border-gray-300 bg-white text-stone rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-glacier"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value as ProductCategory | 'todas')}
            className="border border-gray-300 bg-white text-stone rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-glacier"
          >
            {CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        {error && <ErrorState message={error} onRetry={refetchProducts} />}

        {!loading && !error && products.length === 0 && (
          <EmptyState
            icon="🔍"
            title="No se encontraron productos"
            description="Probá con otra categoría o término de búsqueda"
          />
        )}

        {products.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product: typeof products[number]) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {hasMore && !searching && (
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