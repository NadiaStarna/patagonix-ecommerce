import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/auth'
import { getOrdersByUser } from '../../services/orders.service'
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

export const OrdersPage = () => {
  const { user } = useAuth()
  const location = useLocation()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const justConfirmed = (location.state as { confirmed?: boolean } | null)?.confirmed

  useEffect(() => {
    if (!user) return
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const data = await getOrdersByUser(user.uid)
        setOrders(data)
      } catch (err) {
        setError('Error al cargar tus órdenes')
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

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-navy mb-6">Mis órdenes</h1>

      {justConfirmed && (
        <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg mb-4">
          ¡Compra confirmada con éxito! 🎉
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📦</p>
          <p className="text-lg font-medium">Todavía no tenés órdenes</p>
          <Link to={ROUTES.PRODUCTS} className="mt-4 inline-block bg-navy text-white px-6 py-2 rounded-lg text-sm">
            Ir al catálogo
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map(order => (
            <Link
              key={order.id}
              to={ROUTES.ORDER_DETAIL.replace(':id', order.id)}
              className="bg-white rounded-2xl shadow-sm p-4 flex items-center justify-between hover:shadow-md transition"
            >
              <div>
                <p className="font-medium text-navy text-sm">Orden #{order.id.slice(0, 8)}</p>
                <p className="text-xs text-gray-400">
                  {order.createdAt.toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
                <p className="text-xs text-gray-500">{order.items.length} producto(s)</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-teal">${order.total.toLocaleString('es-AR')}</p>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status]}`}>
                  {STATUS_LABELS[order.status]}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}