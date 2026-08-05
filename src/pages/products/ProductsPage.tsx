// src/pages/products/ProductsPage.tsx
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useProducts } from '../../contexts/products'
import { ProductCard } from '../../components/common/ProductCard'
import { Hero } from '../../components/common/Hero'
import { CategoryIcons } from '../../components/common/CategoryIcons'
import { FeaturedProducts } from '../../components/common/FeaturedProducts'
import { EmptyState } from '../../components/common/EmptyState'
import { ErrorState } from '../../components/common/ErrorState'
import { X } from 'lucide-react'
import { CATEGORIES_WITH_ALL } from '../../utils/categories'

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

  // Mientras Firestore carga por primera vez, mostramos solo el spinner.
  // Ojo: solo en la carga inicial (products.length === 0) — si ya hay productos
  // cargados y el usuario cambia de categoría, NO desmontamos toda la página
  // (eso hacía que el scroll volviera arriba, al hero, en cada cambio de filtro).
  if (loading && !searching && products.length === 0) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-3 bg-fog z-50">
        <div className="w-10 h-10 border-4 border-glacier border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400">Cargando productos...</p>
      </div>
    )
  }

  const categoryLabel = CATEGORIES_WITH_ALL.find(c => c.value === selectedCategory)?.label
  const hasActiveFilter = selectedCategory !== 'todas' || searchQuery.trim().length > 0

  const clearFilters = () => {
    setSelectedCategory('todas')
    setSearchQuery('')
  }

  return (
    <div>
      <Hero />
      <CategoryIcons />
      <FeaturedProducts />

      <div id="catalogo" className="max-w-7xl mx-auto px-4 py-8 scroll-mt-6">

        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <h2 className="text-lg font-bold text-stone" style={{ fontFamily: 'var(--font-display)' }}>
            Catálogo
          </h2>
          {hasActiveFilter && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-xs bg-fog text-stone px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors"
            >
              {searchQuery.trim()
                ? `Búsqueda: "${searchQuery}"`
                : `Categoría: ${categoryLabel}`}
              <X size={12} />
            </button>
          )}
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
            <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-4 transition-opacity ${loading ? 'opacity-50' : 'opacity-100'}`}>
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