import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart } from 'lucide-react'
import type { Product } from '../../types'
import { ROUTES } from '../../routes/routes'
import { useFavorites } from '../../contexts/favorites'
import { useAuth } from '../../contexts/auth'
import { useCart } from '../../contexts/cart'
import { useToast } from '../../contexts/toast'

interface ProductCardProps {
  product: Product
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const productDetailRoute = ROUTES.PRODUCT_DETAIL.replace(':id', product.id)
  const { isFavorite, toggleFavorite } = useFavorites()
  const { user } = useAuth()
  const { addItem } = useCart()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [quantity, setQuantity] = useState(1)

  const favorite = isFavorite(product.id)

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) return
    toggleFavorite(product.id)
  }

  const handleQuantityChange = (e: React.MouseEvent, delta: number) => {
    e.preventDefault()
    e.stopPropagation()
    setQuantity(q => Math.min(product.stock, Math.max(1, q + delta)))
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      navigate(ROUTES.LOGIN)
      return
    }
    for (let i = 0; i < quantity; i++) {
      addItem(product)
    }
    showToast({
      title: 'Agregado al carrito',
      description: `${product.name} x${quantity}`,
    })
    setQuantity(1)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group border-t-4 border-sunset h-full flex flex-col">

      {/* Imagen */}
      <div className="relative overflow-hidden h-48 shrink-0">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute top-2 left-2 bg-stone text-white text-xs px-2 py-1 rounded-full">
          {product.category}
        </span>

        {user && (
          <button
            onClick={handleToggleFavorite}
            aria-label={favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            className="absolute top-2 right-2 w-8 h-8 bg-stone rounded-full shadow-sm flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Heart
              size={16}
              className={favorite ? 'text-sunset fill-sunset' : 'text-white'}
            />
          </button>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <Link to={productDetailRoute} className="contents">
          <h3 className="font-semibold text-stone text-sm truncate">{product.name}</h3>
          <p className="text-gray-500 text-xs line-clamp-2 min-h-[2.5rem]">{product.description}</p>

          <span className="text-lg font-bold text-sunset">
            ${product.price.toLocaleString('es-AR')}
          </span>
          <span className={`text-xs ${product.stock > 0 ? 'text-moss' : 'text-red-500'}`}>
            {product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}
          </span>
        </Link>

        {/* Botones, siempre al fondo de la card gracias a mt-auto */}
        <div className="mt-auto flex flex-col gap-2">
          <Link
            to={productDetailRoute}
            className="block text-center bg-stone text-white text-sm py-2 rounded-lg hover:bg-opacity-90 transition"
          >
            Ver detalle
          </Link>

          {product.stock > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-glacier text-white text-sm py-2 rounded-lg hover:bg-opacity-90 active:scale-95 active:bg-stone transition"
              >
                Agregar
              </button>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden shrink-0">
                <button
                  onClick={e => handleQuantityChange(e, -1)}
                  className="px-2 py-2 bg-gray-100 hover:bg-gray-200 transition text-sm"
                >
                  −
                </button>
                <span className="px-3 py-2 text-xs font-medium">{quantity}</span>
                <button
                  onClick={e => handleQuantityChange(e, 1)}
                  className="px-2 py-2 bg-gray-100 hover:bg-gray-200 transition text-sm"
                >
                  +
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}