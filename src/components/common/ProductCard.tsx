import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, Star } from 'lucide-react'
import type { Product } from '../../types'
import { ROUTES } from '../../routes/routes'
import { useFavorites } from '../../contexts/favorites'
import { useAuth } from '../../contexts/auth'
import { useCart } from '../../contexts/cart'
import { useToast } from '../../contexts/toast'
import { useSettings } from '../../contexts/settings'

interface ProductCardProps {
  product: Product
  featured?: boolean
  compact?: boolean
}

export const ProductCard = ({ product, featured = false, compact = false }: ProductCardProps) => {
  const productDetailRoute = ROUTES.PRODUCT_DETAIL.replace(':id', product.id)
  const { isFavorite, toggleFavorite } = useFavorites()
  const { user } = useAuth()
  const { addItem } = useCart()     //
  const { showToast } = useToast()
  const { settings } = useSettings()
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

  const handleAddToCart = (e: React.MouseEvent) => {  //
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

      <div className={`relative overflow-hidden shrink-0 ${compact ? 'h-28' : 'h-48'}`}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
        {!featured && (
          <span className="absolute top-2 left-2 bg-stone text-white text-xs px-2 py-1 rounded-full">
            {product.category}
          </span>
        )}

        {featured && (
          <span className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">
            <Star size={10} className="fill-amber-800" />
            Destacado
          </span>
        )}

        <div className="absolute bottom-2 left-2 flex flex-col gap-1 items-start">
          {product.price >= settings.freeShippingThreshold && (
            <span className="bg-moss text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
              Envío gratis
            </span>
          )}
          {product.stock > 0 && product.stock <= 3 && (
            <span className="bg-sunset text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
              Últimas unidades
            </span>
          )}
        </div>

        {user && (
          <button
            onClick={handleToggleFavorite}
            aria-label={favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            className={`absolute top-2 right-2 bg-stone rounded-full shadow-sm flex items-center justify-center hover:scale-110 transition-transform ${compact ? 'w-6 h-6' : 'w-8 h-8'}`}>
            <Heart
              size={compact ? 12 : 16}
              className={favorite ? 'text-sunset fill-sunset' : 'text-white'}
            />
          </button>
        )}
      </div>

      <div className={`flex flex-col gap-1.5 flex-1 ${compact ? 'p-3' : 'p-4 gap-2'}`}>
        <Link to={productDetailRoute} className="contents">
          <h3 className={`font-semibold text-stone truncate ${compact ? 'text-xs' : 'text-sm'}`}>{product.name}</h3>
          {!compact && (
            <p className="text-gray-500 text-xs line-clamp-2 min-h-[2.5rem]">{product.description}</p>
          )}

          <span className={`font-bold text-sunset ${compact ? 'text-sm' : 'text-lg'}`}>
            ${product.price.toLocaleString('es-AR')}
          </span>
          {!compact && (
            <span className={`text-xs ${product.stock > 0 ? 'text-moss' : 'text-red-500'}`}>
              {product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}
            </span>
          )}
        </Link>

        <div className="mt-auto flex flex-col gap-2">
          {compact ? (
            product.stock > 0 && (
              <button
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-[#4A2E4A] to-[#B05A3A] text-white text-xs py-1.5 rounded-lg hover:brightness-110 active:scale-95 transition">
                Agregar
              </button>
            )
          ) : (
            product.stock > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-[#4A2E4A] to-[#B05A3A] text-white text-sm py-2 rounded-lg hover:brightness-110 active:scale-95 transition">
                  Agregar
                </button>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden shrink-0">
                  <button
                    onClick={e => handleQuantityChange(e, -1)}
                    className="px-2 py-2 bg-gray-100 hover:bg-gray-200 transition text-sm">
                    −
                  </button>
                  <span className="px-3 py-2 text-xs font-medium">{quantity}</span>
                  <button
                    onClick={e => handleQuantityChange(e, 1)}
                    className="px-2 py-2 bg-gray-100 hover:bg-gray-200 transition text-sm">
                    +
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>

    </div>
  )
}