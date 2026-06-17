import { useProducts } from '../../contexts/products'
import { ProductCard } from '../../components/common/ProductCard'
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
  const { filteredProducts, loading, error, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery, refetchProducts } = useProducts()

  return (
    <div>
      {/* Banner oferta */}
      <div className="bg-navy text-white rounded-2xl p-8 mb-8 flex items-center justify-between">
        <div>
          <p className="text-gold text-sm font-semibold mb-1">Oferta especial</p>
          <h2 className="text-3xl font-bold mb-2">Hasta 50% Off</h2>
          <p className="text-aqua text-sm mb-4">Oferta por tiempo limitado en productos seleccionados</p>
          <button className="bg-gold text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition">
            Ver ofertas →
          </button>
        </div>
        <div className="hidden md:block text-8xl">🛍️</div>
      </div>

      {/* Búsqueda */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Buscar productos..."
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-teal"
        />
      </div>

      {/* Filtros por categoría */}
      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`px-4 py-1 rounded-full text-sm font-medium transition ${
              selectedCategory === cat.value
                ? 'bg-navy text-white'
                : 'bg-white text-navy border border-navy hover:bg-navy hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Estados de UI: loading, error, empty, reutilizables en toda la app */}
      {loading && <LoadingState message="Cargando productos..." />}

      {error && <ErrorState message={error} onRetry={refetchProducts} />}

      {!loading && !error && filteredProducts.length === 0 && (
        <EmptyState
          icon="🔍"
          title="No se encontraron productos"
          description="Probá con otra categoría o término de búsqueda"
        />
      )}

      {/* Grid de productos */}
      {!loading && filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}