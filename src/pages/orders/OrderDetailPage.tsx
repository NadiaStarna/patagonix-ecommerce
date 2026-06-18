import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getOrderById } from '../../services/orders.service'
import type { Order } from '../../types'
import { ROUTES } from '../../routes/routes'

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  processing: 'En proceso',
  completed: 'Completada',
  cancelled: 'Cancelada',
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const fetchOrder = async () => {
      try {
        setLoading(true)
        const data = await getOrderById(id)
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
        <div className="w-10 h-10 border-4 border-glacier border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-lg font-medium">{error ?? 'Orden no encontrada'}</p>
        <Link to={ROUTES.ORDERS} className="text-glacier text-sm hover:underline mt-2 inline-block">
          Volver a mis órdenes
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link to={ROUTES.ORDERS} className="text-glacier text-sm hover:underline mb-4 inline-block">
        ← Volver a mis órdenes
      </Link>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-stone">Orden #{order.id.slice(0, 8)}</h1>
            <p className="text-sm text-gray-500">
              {order.createdAt.toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status]}`}>
            {STATUS_LABELS[order.status]}
          </span>
        </div>

        <div className="flex flex-col gap-4 mb-6">
          {order.items.map(item => (
            <Link
              key={item.productId}
              to={ROUTES.PRODUCT_DETAIL.replace(':id', item.productId)}
              className="flex items-center gap-4 hover:bg-gray-50 -mx-2 px-2 py-1 rounded-lg transition"
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <p className="font-medium text-stone text-sm">{item.name}</p>
                <p className="text-xs text-gray-400">{item.category}</p>
                <p className="text-xs text-gray-500">Cantidad: {item.quantity}</p>
              </div>
              <p className="font-medium text-sunset text-sm">
                ${(item.unitPrice * item.quantity).toLocaleString('es-AR')}
              </p>
            </Link>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-4 flex justify-between">
          <span className="font-semibold text-stone">Total</span>
          <span className="font-bold text-sunset text-lg">${order.total.toLocaleString('es-AR')}</span>
        </div>
      </div>
    </div>
  )
}