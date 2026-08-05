import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Minus, Plus, Trash2, Truck, ShieldCheck, CreditCard, PartyPopper } from 'lucide-react'
import { useCart } from '../../contexts/cart'
import { useSettings } from '../../contexts/settings'
import { getProducts } from '../../services/products.service'
import { ProductCard } from '../../components/common/ProductCard'
import { EmptyState } from '../../components/common/EmptyState'
import { ROUTES } from '../../routes/routes'
import type { Product } from '../../types'

// Tailwind necesita ver las clases completas en el código fuente (no las arma
// bien si las concatenamos con un template string), por eso el mapeo explícito.
const SUGGESTED_GRID_COLS: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-2 sm:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-4',
  5: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5',
}

export const CartPage = () => {
  const { items, total, itemCount, removeItem, updateQuantity, clearCart } = useCart()
  const { settings } = useSettings()
  const navigate = useNavigate()

  const [suggested, setSuggested] = useState<Product[]>([])

  useEffect(() => {
    const fetchSuggested = async () => {
      try {
        const all = await getProducts()
        const cartIds = new Set(items.map(item => item.product.id))
        const available = all.filter(p => !cartIds.has(p.id) && p.stock > 0)
        setSuggested(available.slice(0, 5))
      } catch {
        setSuggested([])
      }
    }
    fetchSuggested()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center text-gray-400 px-4">
          <EmptyState
            icon="🛒"
            title="Tu carrito está vacío"
            description="Agregá productos para comenzar tu compra"
          />
          <Link
            to={ROUTES.PRODUCTS}
            state={{ scrollToCatalog: true }}
            className="mt-2 bg-stone text-white px-6 py-2 rounded-lg text-sm hover:bg-opacity-90 transition md:hidden"
          >
            Ver productos
          </Link>
        </div>

        {suggested.length > 0 && (
          <div className="mt-4">
            <h2 className="text-lg font-bold text-stone mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              También te puede interesar
            </h2>
            <div className={`grid ${SUGGESTED_GRID_COLS[suggested.length] ?? SUGGESTED_GRID_COLS[5]} gap-4`}>
              {suggested.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  const freeShipping = total >= settings.freeShippingThreshold
  const shippingCost = freeShipping ? 0 : settings.shippingCost
  const missingForFreeShipping = settings.freeShippingThreshold - total
  const orderTotal = total + shippingCost
  const suggestedGridCols = SUGGESTED_GRID_COLS[suggested.length] ?? SUGGESTED_GRID_COLS[5]

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">

      <div className="flex items-center gap-2 mb-1">
        <ShoppingCart size={20} className="text-sunset" />
        <h1 className="text-xl font-bold text-stone" style={{ fontFamily: 'var(--font-display)' }}>
          Tu carrito
        </h1>
        <span className="bg-sunset text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
          {itemCount}
        </span>
      </div>
      <p className="text-gray-500 text-sm mb-5">
        Revisá tus productos, actualizá cantidades y finalizá tu compra.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">

        {/* Lista de productos */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          <div className="hidden sm:grid grid-cols-[1fr_5rem_7rem_5rem_1.5rem] gap-3 bg-white rounded-xl shadow-sm px-3 py-3 text-xs text-gray-400 uppercase font-medium shrink-0">
            <span>Producto</span>
            <span>Precio</span>
            <span className="text-center">Cantidad</span>
            <span className="text-right">Subtotal</span>
            <span></span>
          </div>
          <div className="flex flex-col gap-2.5 max-h-[350px] overflow-y-auto pr-1">
            {items.map(item => (
              <div key={item.product.id} className="bg-white rounded-xl shadow-sm p-3 grid grid-cols-[1fr_auto_auto_auto] sm:grid-cols-[1fr_5rem_7rem_5rem_1.5rem] items-center gap-3 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-14 h-14 object-cover rounded-lg shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="font-semibold text-stone text-sm truncate">{item.product.name}</h3>
                    <p className={`text-xs mt-0.5 ${item.product.stock > 0 ? 'text-moss' : 'text-red-500'}`}>
                      {item.product.stock > 0 ? 'En stock' : 'Sin stock'}
                    </p>
                  </div>
                </div>

                <p className="hidden sm:block text-sm text-gray-500">
                  ${item.product.price.toLocaleString('es-AR')}
                </p>

                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden shrink-0 justify-self-center">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="w-7 h-7 bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
                    aria-label="Restar"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-7 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="w-7 h-7 bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
                    aria-label="Sumar"
                  >
                    <Plus size={12} />
                  </button>
                </div>

                <p className="font-bold text-stone text-sm text-right">
                  ${(item.product.price * item.quantity).toLocaleString('es-AR')}
                </p>

                <button
                  onClick={() => removeItem(item.product.id)}
                  className="text-gray-300 hover:text-red-400 transition shrink-0 justify-self-end"
                  aria-label="Quitar producto"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <Link
              to={ROUTES.PRODUCTS}
              state={{ scrollToCatalog: true }}
              className="text-sm text-gray-500 hover:text-stone transition"
            >
              ← Seguir comprando
            </Link>
            <button
              onClick={clearCart}
              className="text-sm text-red-400 hover:text-red-600 transition"
            >
              Vaciar carrito
            </button>
          </div>
        </div>

        {/* Resumen del pedido — una sola tarjeta, alineada arriba con la lista */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="font-bold text-stone text-base mb-3">Resumen de tu pedido</h2>

          <div className="flex flex-col gap-1.5 text-sm mb-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({itemCount} {itemCount === 1 ? 'producto' : 'productos'})</span>
              <span>${total.toLocaleString('es-AR')}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Envío</span>
              <span className={freeShipping ? 'text-moss font-medium' : ''}>
                {freeShipping ? 'Gratis' : `$${shippingCost.toLocaleString('es-AR')}`}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Descuentos</span>
              <span>-$0</span>
            </div>
          </div>

          <hr className="border-gray-200 mb-3" />

          <div className="flex justify-between font-bold text-stone text-base mb-3">
            <span>Total</span>
            <span>${orderTotal.toLocaleString('es-AR')}</span>
          </div>

          {freeShipping ? (
            <div className="flex items-center gap-2 bg-moss/10 text-moss text-xs rounded-lg px-3 py-2 mb-3">
              <PartyPopper size={14} className="shrink-0" />
              ¡Felicidades! Tu envío es gratis. Te ahorraste ${settings.shippingCost.toLocaleString('es-AR')}.
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-fog text-gray-600 text-xs rounded-lg px-3 py-2 mb-3">
              <Truck size={14} className="shrink-0" />
              Te faltan ${missingForFreeShipping.toLocaleString('es-AR')} para envío gratis
            </div>
          )}

          <button
            onClick={() => navigate(ROUTES.CHECKOUT)}
            className="w-full bg-sunset text-white py-2.5 rounded-lg font-semibold hover:bg-opacity-90 transition"
          >
            Finalizar compra
          </button>

          <p className="flex items-center justify-center gap-1.5 text-xs text-gray-400 mt-2.5 mb-4">
            <ShieldCheck size={12} />
            Compra 100% segura
          </p>

          <hr className="border-gray-100 mb-3" />

          <p className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <CreditCard size={14} className="text-glacier" />
            Aceptamos tarjetas de crédito y débito, y transferencia
          </p>
          <div className="flex flex-col gap-1.5 text-xs text-gray-500">
            <span className="flex items-center gap-1.5"><Truck size={12} className="text-glacier" /> Envío gratis en compras +${settings.freeShippingThreshold.toLocaleString('es-AR')}</span>
            <span className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-glacier" /> Cambios fáciles hasta 30 días</span>
          </div>
        </div>

      </div>

      {/* También te puede interesar */}
      {suggested.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-bold text-stone mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            También te puede interesar
          </h2>
          <div className={`grid ${suggestedGridCols} gap-4`}>
            {suggested.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

    </div>
  )
}