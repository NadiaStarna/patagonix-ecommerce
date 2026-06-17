import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../contexts/cart'
import { useAuth } from '../../contexts/auth'
import { createOrder } from '../../services/orders.service'
import { ROUTES } from '../../routes/routes'
import type { OrderItem } from '../../types'

export const CheckoutPage = () => {
  const { items, itemCount, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  const handleConfirmPurchase = async () => {
    if (!user) return
    setError(null)
    setLoading(true)

    try {
      // Construimos el snapshot de cada item: solo los campos relevantes
      // del producto al momento de la compra, no el objeto completo
      const orderItems: OrderItem[] = items.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        imageUrl: item.product.imageUrl,
        category: item.product.category,
        unitPrice: item.product.price,
        quantity: item.quantity,
      }))

      await createOrder({
        userId: user.uid,
        items: orderItems,
        total,
        status: 'pending',
      })

      // Navegamos primero y limpiamos el carrito después, para evitar que
      // el guard de carrito vacío redirija antes de completar la navegación
      navigate(ROUTES.ORDERS, { state: { confirmed: true } })
      clearCart()
    } catch (err) {
      setError('Ocurrió un error al confirmar la compra. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (itemCount === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-3">🛒</p>
        <p className="text-lg font-medium">Tu carrito está vacío</p>
        <button
          onClick={() => navigate(ROUTES.PRODUCTS)}
          className="mt-4 bg-navy text-white px-6 py-2 rounded-lg text-sm"
        >
          Ir al catálogo
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-navy mb-6">Confirmar compra</h1>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-navy mb-4">Resumen del pedido</h2>
        <div className="flex flex-col gap-3">
          {items.map(item => (
            <div key={item.product.id} className="flex justify-between text-sm">
              <span className="text-gray-600">{item.product.name} x{item.quantity}</span>
              <span className="font-medium text-navy">
                ${(item.product.price * item.quantity).toLocaleString('es-AR')}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between">
          <span className="font-semibold text-navy">Total</span>
          <span className="font-bold text-teal text-lg">${total.toLocaleString('es-AR')}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-navy mb-2">Método de pago</h2>
        <p className="text-sm text-gray-500">
          Pago simulado — esta es una compra de demostración, no se procesa ningún cobro real.
        </p>
      </div>

      <button
        onClick={handleConfirmPurchase}
        disabled={loading}
        className="w-full bg-navy text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition disabled:opacity-50"
      >
        {loading ? 'Procesando...' : 'Confirmar compra'}
      </button>
    </div>
  )
}