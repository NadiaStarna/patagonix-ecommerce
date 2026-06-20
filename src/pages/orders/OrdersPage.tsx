// src/pages/orders/OrdersPage.tsx
import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/auth'
import { getOrdersByUser } from '../../services/orders.service'
import type { Order, OrderStatus } from '../../types'
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

const STATUS_OPTIONS: { label: string; value: OrderStatus }[] = [
  { label: 'Pendiente', value: 'pending' },
  { label: 'En proceso', value: 'processing' },
  { label: 'Completada', value: 'completed' },
  { label: 'Cancelada', value: 'cancelled' },
]

export const OrdersPage = () => {
  const { user } = useAuth()
  const location = useLocation()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'todas'>('todas')

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

  const filteredOrders = statusFilter === 'todas'
    ? orders
    : orders.filter(o => o.status === statusFilter)

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-glacier border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto pt-8 pb-8">

      <div className="flex items-center justify-between mb-6 px-4">
        <h1 className="text-2xl font-bold text-stone">Mis órdenes</h1>
        {orders.length > 0 && (
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as OrderStatus | 'todas')}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-stone focus:outline-none focus:border-glacier"
          >
            <option value="todas">Todas</option>
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        )}
      </div>

      {justConfirmed && (
        <div className="mx-4 bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg mb-4">
          ¡Compra confirmada con éxito! 🎉
        </div>
      )}

      {error && (
        <div className="mx-4 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center text-gray-400 px-4">
          <p className="text-4xl mb-3">📦</p>
          <p className="text-lg font-medium">Todavía no tenés órdenes</p>
          <Link
            to={ROUTES.PRODUCTS}
            state={{ scrollToCatalog: true }}
            className="mt-4 inline-block bg-stone text-white px-6 py-2 rounded-lg text-sm"
          >
            Ir al catálogo
          </Link>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 text-gray-400 px-4">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-lg font-medium">No tenés órdenes con ese estado</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 px-4">
          {filteredOrders.map(order => (
            <Link
              key={order.id}
              to={ROUTES.ORDER_DETAIL.replace(':id', order.id)}
              className="bg-white rounded-2xl shadow-sm p-4 flex items-center justify-between hover:shadow-md transition"
            >
              <div>
                <p className="font-medium text-stone text-sm">Orden #{order.id.slice(0, 8)}</p>
                <p className="text-xs text-gray-400">
                  {order.createdAt.toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
                <p className="text-xs text-gray-500">{order.items.length} producto(s)</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sunset">${order.total.toLocaleString('es-AR')}</p>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status]}`}>
                  {STATUS_LABELS[order.status]}
                </span>
              </div>
            </Link>
          ))}

          {/* Volver al catálogo — solo mobile */}
          <Link
            to={ROUTES.PRODUCTS}
            state={{ scrollToCatalog: true }}
            className="md:hidden block text-center text-sm text-gray-500 hover:text-stone transition mt-2"
          >
            ← Ir al catálogo
          </Link>
        </div>
      )}
    </div>
  )
}