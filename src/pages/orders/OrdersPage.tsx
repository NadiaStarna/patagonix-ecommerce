import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/auth'
import { getOrdersByUser } from '../../services/orders.service'
import type { Order } from '../../types'

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-600' },
  processing: { label: 'En proceso', color: 'bg-blue-100 text-blue-600' },
  completed: { label: 'Completada', color: 'bg-green-100 text-green-600' },
  cancelled: { label: 'Cancelada', color: 'bg-red-100 text-red-600' },
}

export const OrdersPage = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return
      try {
        setLoading(true)
        const data = await getOrdersByUser(user.uid)
        setOrders(data)
      } catch (err) {
        setError('Error al cargar las órdenes')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user])

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-10 h-10 border-4 border-teal border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
        {error}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-6xl mb-4">📦</p>
        <p className="text-xl font-medium text-navy mb-2">No tenés órdenes todavía</p>
        <p className="text-sm mb-6">Cuando realices una compra aparecerá acá</p>
        <Link
          to="/products"
          className="bg-navy text-white px-6 py-2 rounded-lg text-sm hover:bg-opacity-90 transition"
        >
          Ver productos
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-navy mb-6">Mis órdenes</h1>

      <div className="flex flex-col gap-4">
        {orders.map(order => {
          const status = STATUS_LABELS[order.status]
          return (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-gray-400">
                  Orden #{order.id.slice(0, 8).toUpperCase()}
                </p>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${status.color}`}>
                  {status.label}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    {order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {order.createdAt instanceof Date
                      ? order.createdAt.toLocaleDateString('es-AR')
                      : ''}
                  </p>
                </div>
                <p className="font-bold text-teal text-lg">
                  ${order.total.toLocaleString('es-AR')}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}