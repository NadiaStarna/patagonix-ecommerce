import { Link } from 'react-router-dom'
import type { Product } from '../../types'
import { ROUTES } from '../../routes/routes'

interface ProductCardProps {
  product: Product
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const productDetailRoute = ROUTES.PRODUCT_DETAIL.replace(':id', product.id)

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group">

      {/* Imagen */}
      <div className="relative overflow-hidden h-48">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Badge de categoría */}
        <span className="absolute top-2 left-2 bg-navy text-white text-xs px-2 py-1 rounded-full">
          {product.category}
        </span>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="font-semibold text-navy text-sm truncate">{product.name}</h3>
        <p className="text-gray-500 text-xs line-clamp-2">{product.description}</p>

        {/* Precio y stock en líneas separadas */}
        <span className="text-lg font-bold text-teal">
          ${product.price.toLocaleString('es-AR')}
        </span>
        <span className={`text-xs ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
          {product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}
        </span>

        {/* Botón ver detalle */}
        <Link
          to={productDetailRoute}
          className="mt-1 block text-center bg-navy text-white text-sm py-2 rounded-lg hover:bg-opacity-90 transition"
        >
          Ver detalle
        </Link>
      </div>

    </div>
  )
}