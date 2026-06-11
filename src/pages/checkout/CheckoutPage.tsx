import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useCart } from '../../contexts/cart'
import { useAuth } from '../../contexts/auth'
import { createOrder } from '../../services/orders.service'
import { ROUTES } from '../../routes/routes'

export const CheckoutPage = () => {
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  // Solo redirigimos al carrito si no estamos procesando ni confirmamos
  if (items.length === 0 && !confirmed && !loading) {
    return <Navigate to={ROUTES.CART} replace />
  }

  const handleConfirmOrder = async () => {
    if (!user || items.length === 0) return

    try {
      setLoading(true)
      setError(null)

      const orderId = await createOrder({
        userId: user.uid,
        items: items.map(item => ({
          product: item.product,
          quantity: item.quantity,
          unitPrice: item.product.price,
        })),
        total,
        status: 'pending',
      })

      setConfirmed(true)
      clearCart()
      navigate(`/orders/${orderId}`)

    } catch (err) {
      console.error('Error al crear la orden:', err)
      setError('Error al confirmar la orden. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-navy mb-6">Confirmar compra</h1>

      {/* Resumen de productos */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-navy mb-4">Productos</h2>
        <div className="flex flex-col gap-3">
          {items.map(item => (
            <div key={item.product.id} className="flex items-center gap-4">
              <img
                src={item.product.imageUrl}
                alt={item.product.name}
                className="w-12 h-12 object-cover rounded-lg"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-navy">{item.product.name}</p>
                <p className="text-xs text-gray-500">Cantidad: {item.quantity}</p>
              </div>
              <p className="font-semibold text-teal text-sm">
                ${(item.product.price * item.quantity).toLocaleString('es-AR')}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Simulación de pago */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-navy mb-4">Método de pago</h2>
        <div className="border border-gray-200 rounded-lg p-4 flex items-center gap-3 bg-gray-50">
          <span className="text-2xl">💳</span>
          <div>
            <p className="text-sm font-medium text-navy">Tarjeta de crédito simulada</p>
            <p className="text-xs text-gray-500">**** **** **** 1234</p>
          </div>
          <span className="ml-auto text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
            Simulado
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          * El pago es una simulación. No se realizará ningún cargo real.
        </p>
      </div>

      {/* Total y confirmar */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <span className="text-lg font-bold text-navy">Total a pagar</span>
          <span className="text-2xl font-bold text-teal">
            ${total.toLocaleString('es-AR')}
          </span>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <button
          onClick={handleConfirmOrder}
          disabled={loading}
          className="w-full bg-navy text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition disabled:opacity-50"
        >
          {loading ? 'Procesando...' : 'Confirmar y pagar'}
        </button>

        <button
          onClick={() => navigate(ROUTES.CART)}
          className="w-full text-sm text-gray-500 hover:text-navy transition mt-3 text-center block"
        >
          ← Volver al carrito
        </button>
      </div>
    </div>
  )
}