import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getOrderById } from '../../services/orders.service'
import type { Order } from '../../types'
import { ROUTES } from '../../routes/routes'

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-600' },
  processing: { label: 'En proceso', color: 'bg-blue-100 text-blue-600' },
  completed: { label: 'Completada', color: 'bg-green-100 text-green-600' },
  cancelled: { label: 'Cancelada', color: 'bg-red-100 text-red-600' },
}

export const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return
      try {
        setLoading(true)
        const data = await getOrderById(id)
        if (!data) {
          setError('Orden no encontrada')
          return
        }
        setOrder(data)
      } catch (err) {
        setError('Error al cargar la orden')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-10 h-10 border-4 border-teal border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-3">😕</p>
        <p className="text-lg font-medium">{error || 'Orden no encontrada'}</p>
        <button
          onClick={() => navigate(ROUTES.ORDERS)}
          className="mt-4 bg-navy text-white px-6 py-2 rounded-lg text-sm hover:bg-opacity-90 transition"
        >
          Volver a mis órdenes
        </button>
      </div>
    )
  }

  const status = STATUS_LABELS[order.status]

  return (
    <div className="max-w-3xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy">
            Orden #{order.id.slice(0, 8).toUpperCase()}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {order.createdAt instanceof Date
              ? order.createdAt.toLocaleDateString('es-AR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : ''}
          </p>
        </div>
        <span className={`text-sm px-3 py-1 rounded-full font-medium ${status.color}`}>
          {status.label}
        </span>
      </div>

      {/* Productos */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-navy mb-4">Productos</h2>
        <div className="flex flex-col gap-4">
          {order.items.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <img
                src={item.product.imageUrl}
                alt={item.product.name}
                className="w-14 h-14 object-cover rounded-lg"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-navy">{item.product.name}</p>
                <p className="text-xs text-gray-500">
                  Cantidad: {item.quantity} × ${item.unitPrice.toLocaleString('es-AR')}
                </p>
              </div>
              <p className="font-semibold text-teal text-sm">
                ${(item.unitPrice * item.quantity).toLocaleString('es-AR')}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center">
          <span className="font-bold text-navy text-lg">Total</span>
          <span className="font-bold text-teal text-2xl">
            ${order.total.toLocaleString('es-AR')}
          </span>
        </div>
      </div>

      {/* Volver */}
      <button
        onClick={() => navigate(ROUTES.ORDERS)}
        className="text-sm text-gray-500 hover:text-navy transition"
      >
        ← Volver a mis órdenes
      </button>

    </div>
  )
}