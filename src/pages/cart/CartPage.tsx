import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../contexts/cart'
import { ROUTES } from '../../routes/routes'
import { EmptyState } from '../../components/common/EmptyState'

export const CartPage = () => {
  const { items, total, removeItem, updateQuantity, clearCart } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <EmptyState
          icon="🛒"
          title="Tu carrito está vacío"
          description="Agregá productos para comenzar tu compra"
        />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone">Mi carrito</h1>
        <button
          onClick={clearCart}
          className="text-sm text-red-400 hover:text-red-600 transition"
        >
          Vaciar carrito
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Lista de items */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {items.map(item => (
            <div key={item.product.id} className="bg-white rounded-2xl shadow-sm p-4 flex gap-4">

              <img
                src={item.product.imageUrl}
                alt={item.product.name}
                className="w-20 h-20 object-cover rounded-lg"
              />

              <div className="flex-1">
                <h3 className="font-semibold text-stone text-sm">{item.product.name}</h3>
                <p className="text-sunset font-bold mt-1">
                  ${item.product.price.toLocaleString('es-AR')}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center text-sm transition"
                  >
                    −
                  </button>
                  <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center text-sm transition"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="text-gray-300 hover:text-red-400 transition text-lg"
                >
                  ✕
                </button>
                <p className="font-bold text-stone text-sm">
                  ${(item.product.price * item.quantity).toLocaleString('es-AR')}
                </p>
              </div>

            </div>
          ))}
        </div>

        {/* Resumen */}
        <div className="bg-white rounded-2xl shadow-sm p-6 h-fit">
          <h2 className="font-bold text-stone text-lg mb-4">Resumen</h2>

          <div className="flex flex-col gap-2 text-sm mb-4">
            {items.map(item => (
              <div key={item.product.id} className="flex justify-between text-gray-500">
                <span>{item.product.name} x{item.quantity}</span>
                <span>${(item.product.price * item.quantity).toLocaleString('es-AR')}</span>
              </div>
            ))}
          </div>

          <hr className="border-gray-200 mb-4" />

          <div className="flex justify-between font-bold text-stone mb-6">
            <span>Total</span>
            <span>${total.toLocaleString('es-AR')}</span>
          </div>

          <button
            onClick={() => navigate(ROUTES.CHECKOUT)}
            className="w-full bg-stone text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition"
          >
            Confirmar compra
          </button>

          <Link
            to={ROUTES.PRODUCTS}
            state={{ scrollToCatalog: true }}
            className="block text-center text-sm text-gray-500 hover:text-stone transition mt-3"
          >
            ← Seguir comprando
          </Link>
        </div>

      </div>
    </div>
  )
}