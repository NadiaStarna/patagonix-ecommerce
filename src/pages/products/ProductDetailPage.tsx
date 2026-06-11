import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProductById } from '../../services/products.service'
import type { Product } from '../../types'
import { ROUTES } from '../../routes/routes'

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return
      try {
        setLoading(true)
        const data = await getProductById(id)
        if (!data) {
          setError('Producto no encontrado')
          return
        }
        setProduct(data)
      } catch (err) {
        setError('Error al cargar el producto')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-10 h-10 border-4 border-teal border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-3">😕</p>
        <p className="text-lg font-medium">{error || 'Producto no encontrado'}</p>
        <button
          onClick={() => navigate(ROUTES.PRODUCTS)}
          className="mt-4 bg-navy text-white px-6 py-2 rounded-lg text-sm hover:bg-opacity-90 transition"
        >
          Volver al catálogo
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <button onClick={() => navigate(ROUTES.PRODUCTS)} className="hover:text-navy transition">
          Productos
        </button>
        <span className="mx-2">/</span>
        <span className="text-navy font-medium">{product.name}</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

          {/* Imagen */}
          <div className="bg-gray-50 flex items-center justify-center p-8 h-80 md:h-auto">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="max-h-64 object-contain"
            />
          </div>

          {/* Info */}
          <div className="p-8 flex flex-col gap-4">
            {/* Categoría */}
            <span className="bg-navy text-white text-xs px-3 py-1 rounded-full w-fit">
              {product.category}
            </span>

            {/* Nombre */}
            <h1 className="text-2xl font-bold text-navy">{product.name}</h1>

            {/* Precio */}
            <p className="text-3xl font-bold text-teal">
              ${product.price.toLocaleString('es-AR')}
            </p>

            {/* Descripción */}
            <p className="text-gray-500 text-sm leading-relaxed">{product.description}</p>

            {/* Stock */}
            <p className={`text-sm font-medium ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {product.stock > 0 ? `✓ ${product.stock} unidades disponibles` : '✗ Sin stock'}
            </p>

            {/* Cantidad */}
            {product.stock > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Cantidad:</span>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition text-lg"
                  >
                    −
                  </button>
                  <span className="px-4 py-1 text-sm font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition text-lg"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Botón agregar al carrito */}
            <button
              disabled={product.stock === 0}
              className="bg-navy text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🛒 Agregar al carrito
            </button>

            {/* Volver */}
            <button
              onClick={() => navigate(ROUTES.PRODUCTS)}
              className="text-sm text-gray-500 hover:text-navy transition text-center"
            >
              ← Volver al catálogo
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}