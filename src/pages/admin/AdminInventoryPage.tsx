import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowUpDown, Boxes, DollarSign, AlertTriangle } from 'lucide-react'
import { getProducts } from '../../services/products.service'
import { ROUTES } from '../../routes/routes'
import type { Product } from '../../types'

type SortField = 'stock' | 'price' | 'value'
type SortDirection = 'asc' | 'desc'

const LOW_STOCK_THRESHOLD = 10

export const AdminInventoryPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState<SortField>('stock')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts()
        setProducts(data)
      } catch {
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-glacier border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const totalStock = products.reduce((sum, p) => sum + p.stock, 0)
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0)
  const outOfStockCount = products.filter(p => p.stock === 0).length
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD).length

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const searchLower = search.trim().toLowerCase()
  const visibleProducts = [...products]
    .filter(p => !searchLower || p.nameLower.includes(searchLower))
    .sort((a, b) => {
      const getValue = (p: Product) =>
        sortField === 'value' ? p.price * p.stock : p[sortField]
      const diff = getValue(a) - getValue(b)
      return sortDirection === 'asc' ? diff : -diff
    })

  const sortIcon = (field: SortField) => (
    <ArrowUpDown size={12} className={sortField === field ? 'text-sunset' : 'text-gray-300'} />
  )

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone mb-5">Inventario</h1>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-1 text-gray-500">
            <Boxes size={14} />
            <p className="text-xs">Unidades en stock</p>
          </div>
          <p className="text-lg font-bold text-stone">{totalStock}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-1 text-gray-500">
            <DollarSign size={14} />
            <p className="text-xs">Valor en inventario</p>
          </div>
          <p className="text-lg font-bold text-stone">${totalValue.toLocaleString('es-AR')}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-1 text-amber-600">
            <AlertTriangle size={14} />
            <p className="text-xs">Stock bajo</p>
          </div>
          <p className="text-lg font-bold text-amber-600">{lowStockCount}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-1 text-red-500">
            <AlertTriangle size={14} />
            <p className="text-xs">Sin stock</p>
          </div>
          <p className="text-lg font-bold text-red-500">{outOfStockCount}</p>
        </div>
      </div>

      {/* Buscador */}
      <div className="relative max-w-md mb-4">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar producto..."
          className="w-full bg-white border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:border-glacier"
        />
      </div>

      {visibleProducts.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-2xl shadow-sm">
          <p className="text-4xl mb-3">📦</p>
          <p className="text-lg font-medium">
            {products.length === 0 ? 'No hay productos todavía' : 'Ningún producto coincide con la búsqueda'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-3 text-left">Producto</th>
                <th className="px-6 py-3 text-left">Categoría</th>
                <th className="px-6 py-3 text-left cursor-pointer select-none" onClick={() => handleSort('price')}>
                  <span className="flex items-center gap-1">Precio {sortIcon('price')}</span>
                </th>
                <th className="px-6 py-3 text-left cursor-pointer select-none" onClick={() => handleSort('stock')}>
                  <span className="flex items-center gap-1">Stock {sortIcon('stock')}</span>
                </th>
                <th className="px-6 py-3 text-left cursor-pointer select-none" onClick={() => handleSort('value')}>
                  <span className="flex items-center gap-1">Valor total {sortIcon('value')}</span>
                </th>
                <th className="px-6 py-3 text-left">Editar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visibleProducts.map(product => (
                <tr key={product.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-9 h-9 object-cover rounded-lg"
                      />
                      <span className="font-medium text-stone truncate max-w-[160px]">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{product.category}</td>
                  <td className="px-6 py-4 text-gray-600">${product.price.toLocaleString('es-AR')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.stock === 0
                        ? 'bg-red-100 text-red-600'
                        : product.stock <= LOW_STOCK_THRESHOLD
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-green-100 text-green-600'
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-sunset">
                    ${(product.price * product.stock).toLocaleString('es-AR')}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      to={ROUTES.ADMIN_PRODUCT_EDIT.replace(':id', product.id)}
                      className="text-glacier hover:underline text-xs"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}