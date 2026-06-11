import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProducts, deleteProduct } from '../../services/products.service'
import type { Product } from '../../types'
import { ROUTES } from '../../routes/routes'

export const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Estás segura de eliminar "${name}"?`)) return
    try {
      await deleteProduct(id)
      setProducts(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      alert('Error al eliminar el producto')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-10 h-10 border-4 border-teal border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy">Productos</h1>
        <Link
          to={ROUTES.ADMIN_PRODUCT_NEW}
          className="bg-navy text-white px-4 py-2 rounded-lg text-sm hover:bg-opacity-90 transition"
        >
          + Nuevo producto
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📦</p>
          <p className="text-lg font-medium">No hay productos todavía</p>
          <Link
            to={ROUTES.ADMIN_PRODUCT_NEW}
            className="mt-4 inline-block bg-navy text-white px-6 py-2 rounded-lg text-sm"
          >
            Crear primer producto
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-3 text-left">Producto</th>
                <th className="px-6 py-3 text-left">Categoría</th>
                <th className="px-6 py-3 text-left">Precio</th>
                <th className="px-6 py-3 text-left">Stock</th>
                <th className="px-6 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded-lg"
                      />
                      <span className="font-medium text-navy">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{product.category}</td>
                  <td className="px-6 py-4 font-medium text-teal">
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
                        className="text-teal hover:underline text-xs"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="text-red-400 hover:underline text-xs"
                      >
                        Eliminar
                      </button>
                    </div>
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