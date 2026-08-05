import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getProducts, deleteProduct } from '../../services/products.service'
import { seedProducts, removeDuplicateProducts } from '../../utils/seedProducts'
import { X, ArrowLeft } from 'lucide-react'
import type { Product } from '../../types'
import { ROUTES } from '../../routes/routes'

export const AdminProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q')?.trim().toLowerCase() ?? ''
  const categoryFilter = searchParams.get('category') ?? ''
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [seeding, setSeeding] = useState(false)
  const [cleaning, setCleaning] = useState(false)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await getProducts()
      setProducts(data)
    } catch (err) {
      setError('Error al cargar los productos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const visibleProducts = products
    .filter(p => !query || p.nameLower.includes(query))
    .filter(p => !categoryFilter || p.category === categoryFilter)

  const clearSearch = () => setSearchParams({})

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Estás segura de eliminar "${name}"?`)) return
    try {
      setDeletingId(id)
      await deleteProduct(id)
      setProducts(prev => prev.filter(p => p.id !== id))
    } catch (err: any) {
      if (err?.code === 'permission-denied') {
        alert('No tenés permisos para eliminar productos.')
      } else {
        alert('Error al eliminar el producto. Intentá de nuevo.')
      }
    } finally {
      setDeletingId(null)
    }
  }

  // Botón temporal, solo para cargar los 12 productos de ejemplo una vez.
  // Podés borrar este botón (y este handler) del código después de usarlo.
  const handleSeed = async () => {
    if (!confirm('Esto va a crear los productos de ejemplo que todavía no existan en Firestore. ¿Continuar?')) return
    setSeeding(true)
    try {
      const { created, skipped } = await seedProducts()
      await fetchProducts()
      alert(`Listo: se crearon ${created} productos nuevos. ${skipped} ya existían y se saltearon.`)
    } catch (err) {
      alert('Error al cargar los productos de ejemplo. Revisá la consola.')
    } finally {
      setSeeding(false)
    }
  }

  // Botón temporal, solo para limpiar los duplicados que se generaron por el
  // problema de firebase.ts. Sacalo del código (este handler y el botón) una
  // vez que confirmes que no quedan duplicados.
  const handleRemoveDuplicates = async () => {
    if (!confirm('Esto va a borrar productos duplicados (mismo nombre), dejando solo el más antiguo de cada uno. ¿Continuar?')) return
    setCleaning(true)
    try {
      const { removed } = await removeDuplicateProducts()
      await fetchProducts()
      alert(`Listo: se borraron ${removed} productos duplicados.`)
    } catch (err) {
      alert('Error al limpiar duplicados. Revisá la consola.')
    } finally {
      setCleaning(false)
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-glacier border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          {categoryFilter && (
            <Link
              to={ROUTES.ADMIN_CATEGORIES}
              className="flex items-center gap-1.5 text-sm text-gray-500 border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft size={15} />
              Categorías
            </Link>
          )}
          <h1 className="text-2xl font-bold text-stone">Productos</h1>
          {query && (
            <button
              onClick={clearSearch}
              className="flex items-center gap-1.5 text-xs bg-fog text-stone px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors"
            >
              Búsqueda: "{query}"
              <X size={12} />
            </button>
          )}
          {categoryFilter && (
            <button
              onClick={clearSearch}
              className="flex items-center gap-1.5 text-xs bg-fog text-stone px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors"
            >
              Categoría: {categoryFilter}
              <X size={12} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRemoveDuplicates}
            disabled={cleaning}
            className="border border-red-300 text-red-500 px-4 py-2 rounded-lg text-sm hover:bg-red-50 transition disabled:opacity-50"
          >
            {cleaning ? 'Limpiando...' : 'Borrar duplicados'}
          </button>
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition disabled:opacity-50"
          >
            {seeding ? 'Cargando...' : 'Cargar productos de ejemplo'}
          </button>
          <Link
            to={ROUTES.ADMIN_PRODUCT_NEW}
            className="bg-stone text-white px-4 py-2 rounded-lg text-sm hover:bg-opacity-90 transition"
          >
            + Nuevo producto
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {visibleProducts.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📦</p>
          {query || categoryFilter ? (
            <>
              <p className="text-lg font-medium">
                {query ? `No hay productos que coincidan con "${query}"` : `No hay productos en "${categoryFilter}"`}
              </p>
              <button onClick={clearSearch} className="mt-4 text-glacier hover:underline text-sm">
                Limpiar filtro
              </button>
            </>
          ) : (
            <>
              <p className="text-lg font-medium">No hay productos todavía</p>
              <Link
                to={ROUTES.ADMIN_PRODUCT_NEW}
                className="mt-4 inline-block bg-stone text-white px-6 py-2 rounded-lg text-sm"
              >
                Crear primer producto
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-x-auto overflow-y-auto max-h-[600px]">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left">Producto</th>
                <th className="px-6 py-3 text-left">Categoría</th>
                <th className="px-6 py-3 text-left">Precio</th>
                <th className="px-6 py-3 text-left">Stock</th>
                <th className="px-6 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visibleProducts.map(product => {
                const isDeleting = deletingId === product.id
                return (
                  <tr key={product.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded-lg"
                        />
                        <span className="font-medium text-stone">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{product.category}</td>
                    <td className="px-6 py-4 font-medium text-sunset">
                      ${product.price.toLocaleString('es-AR')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.stock > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={ROUTES.ADMIN_PRODUCT_EDIT.replace(':id', product.id)}
                          className={`text-glacier hover:underline text-xs ${isDeleting ? 'pointer-events-none opacity-50' : ''}`}
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          disabled={isDeleting}
                          className="text-red-400 hover:underline text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isDeleting ? 'Eliminando…' : 'Eliminar'}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}