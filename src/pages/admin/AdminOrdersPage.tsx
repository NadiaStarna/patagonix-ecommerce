import { useState, useEffect } from 'react'
import { getAllOrders, updateOrderStatus } from '../../services/orders.service'
import type { Order, OrderStatus } from '../../types'

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-600' },
  processing: { label: 'En proceso', color: 'bg-blue-100 text-blue-600' },
  completed: { label: 'Completada', color: 'bg-green-100 text-green-600' },
  cancelled: { label: 'Cancelada', color: 'bg-red-100 text-red-600' },
}

const STATUS_OPTIONS: { label: string; value: OrderStatus }[] = [
  { label: 'Pendiente', value: 'pending' },
  { label: 'En proceso', value: 'processing' },
  { label: 'Completada', value: 'completed' },
  { label: 'Cancelada', value: 'cancelled' },
]

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'todas'>('todas')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const data = await getAllOrders()
        setOrders(data)
        setFilteredOrders(data)
      } catch (err) {
        setError('Error al cargar las órdenes')
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  useEffect(() => {
    if (statusFilter === 'todas') {
      setFilteredOrders(orders)
    } else {
      setFilteredOrders(orders.filter(o => o.status === statusFilter))
    }
  }, [statusFilter, orders])

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus)
      setOrders(prev => prev.map(o =>
        o.id === orderId ? { ...o, status: newStatus } : o
      ))
    } catch (err) {
      alert('Error al actualizar el estado')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-10 h-10 border-4 border-teal border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">Órdenes</h1>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap mb-6">
        <button
          onClick={() => setStatusFilter('todas')}
          className={`px-4 py-1 rounded-full text-sm font-medium transition ${
            statusFilter === 'todas'
              ? 'bg-navy text-white'
              : 'bg-white text-navy border border-navy hover:bg-navy hover:text-white'
          }`}
        >
          Todas
        </button>
        {STATUS_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => setStatusFilter(opt.value)}
            className={`px-4 py-1 rounded-full text-sm font-medium transition ${
              statusFilter === opt.value
                ? 'bg-navy text-white'
                : 'bg-white text-navy border border-navy hover:bg-navy hover:text-white'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🧾</p>
          <p className="text-lg font-medium">No hay órdenes</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-3 text-left">Orden</th>
                <th className="px-6 py-3 text-left">Usuario</th>
                <th className="px-6 py-3 text-left">Total</th>
                <th className="px-6 py-3 text-left">Fecha</th>
                <th className="px-6 py-3 text-left">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map(order => {
                const status = STATUS_LABELS[order.status]
                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-navy">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {order.userId.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4 font-medium text-teal">
                      ${order.total.toLocaleString('es-AR')}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {order.createdAt instanceof Date
                        ? order.createdAt.toLocaleDateString('es-AR')
                        : ''}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={e => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        className={`text-xs px-2 py-1 rounded-full font-medium border-0 cursor-pointer ${status.color}`}
                      >
                        {STATUS_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}