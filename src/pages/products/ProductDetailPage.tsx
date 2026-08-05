import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProductById, getProducts } from '../../services/products.service'
import { ArrowLeft, Heart, Truck, ShieldCheck, RotateCcw } from 'lucide-react'
import type { Product } from '../../types'
import { ROUTES } from '../../routes/routes'
import { useCart } from '../../contexts/cart'
import { useAuth } from '../../contexts/auth'
import { useToast } from '../../contexts/toast'
import { useFavorites } from '../../contexts/favorites'
import { useSettings } from '../../contexts/settings'
import { ProductCard } from '../../components/common/ProductCard'

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { user } = useAuth()
  const { showToast } = useToast()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { settings } = useSettings()

  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return
      try {
        setLoading(true)
        setQuantity(1)
        const data = await getProductById(id)
        if (!data) {
          setError('Producto no encontrado')
          return
        }
        setProduct(data)

        const all = await getProducts()
        const sameCategory = all.filter(p => p.category === data.category && p.id !== data.id)
        setRelated(sameCategory.slice(0, 5))
      } catch (err) {
        setError('Error al cargar el producto')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
    window.scrollTo(0, 0)
  }, [id])

  const handleAddToCart = () => {
    if (!user) {
      navigate(ROUTES.LOGIN)
      return
    }
    if (!product) return
    for (let i = 0; i < quantity; i++) {
      addItem(product)
    }
    showToast({
      title: 'Agregado al carrito',
      description: `${product.name} x${quantity}`,
    })
    setQuantity(1)
  }

  const handleToggleFavorite = () => {
    if (!user || !product) return
    toggleFavorite(product.id)
  }

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-glacier border-t-transparent rounded-full animate-spin" />
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
          className="mt-4 bg-stone text-white px-6 py-2 rounded-lg text-sm hover:bg-opacity-90 transition"
        >
          Volver al catálogo
        </button>
      </div>
    )
  }

  const favorite = isFavorite(product.id)
  const freeShipping = product.price >= settings.freeShippingThreshold

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* Breadcrumb + Atrás */}
      <div className="flex items-center justify-between mb-6">
        <nav className="text-sm text-gray-500">
          <button onClick={() => navigate(ROUTES.PRODUCTS)} className="hover:text-stone transition">
            Productos
          </button>
          <span className="mx-2">/</span>
          <span className="text-stone font-medium">{product.name}</span>
        </nav>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-500 border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors shrink-0"
        >
          <ArrowLeft size={15} />
          Atrás
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

          {/* Imagen */}
          <div className="relative bg-gray-50 flex items-center justify-center p-8 h-80 md:h-auto">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="max-h-64 object-contain"
            />
            {user && (
              <button
                onClick={handleToggleFavorite}
                aria-label={favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                className="absolute top-4 right-4 w-9 h-9 bg-white rounded-full shadow-sm flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Heart size={18} className={favorite ? 'text-sunset fill-sunset' : 'text-stone'} />
              </button>
            )}
          </div>

          {/* Info */}
          <div className="p-8 flex flex-col gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-stone text-white text-xs px-3 py-1 rounded-full w-fit">
                {product.category}
              </span>
              {freeShipping && (
                <span className="bg-moss text-white text-xs px-3 py-1 rounded-full w-fit">
                  Envío gratis
                </span>
              )}
              {product.stock > 0 && product.stock <= 3 && (
                <span className="bg-sunset text-white text-xs px-3 py-1 rounded-full w-fit">
                  Últimas unidades
                </span>
              )}
            </div>

            <h1 className="text-2xl font-bold text-stone">{product.name}</h1>

            <p className="text-3xl font-bold text-sunset">
              ${product.price.toLocaleString('es-AR')}
            </p>

            <p className="text-gray-500 text-sm leading-relaxed">{product.description}</p>

            <p className={`text-sm font-medium ${product.stock > 0 ? 'text-moss' : 'text-red-500'}`}>
              {product.stock > 0 ? `✓ ${product.stock} unidades disponibles` : '✗ Sin stock'}
            </p>

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

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="bg-gradient-to-r from-[#4A2E4A] to-[#B05A3A] text-white py-3 rounded-lg font-semibold hover:brightness-110 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🛒 Agregar al carrito
            </button>

            <hr className="border-gray-100 mt-1" />

            <div className="flex flex-col gap-2 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <Truck size={13} className="text-glacier" />
                Envío gratis en compras +${settings.freeShippingThreshold.toLocaleString('es-AR')}
              </span>
              <span className="flex items-center gap-1.5">
                <RotateCcw size={13} className="text-glacier" />
                Cambios fáciles hasta 30 días
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-glacier" />
                Compra 100% segura
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* También te puede interesar */}
      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-bold text-stone mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            También te puede interesar
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {related.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}