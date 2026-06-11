import { useProducts } from '../../hooks/useProducts'
import { ProductCard } from '../../components/common/ProductCard'
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
  const { products, loading, error, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } = useProducts()

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

      {/* Estado de carga */}
      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-teal border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Sin productos */}
      {!loading && !error && products.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-lg font-medium">No se encontraron productos</p>
          <p className="text-sm">Probá con otra categoría o término de búsqueda</p>
        </div>
      )}

      {/* Grid de productos */}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}