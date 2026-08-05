import { useState, useEffect, Fragment } from 'react'
import { getAllOrders, updateOrderStatus, deleteOrder } from '../../services/orders.service'
import { getUsersByIds } from '../../services/users.service'
import { Trash2, Search, ChevronDown, ChevronUp, Package, User } from 'lucide-react'
import type { Order, OrderStatus, AppUser } from '../../types'

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pendiente', color: 'bg-amber-100 text-amber-700' },
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
  const [customers, setCustomers] = useState<Map<string, AppUser>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'todas'>('todas')
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const data = await getAllOrders()
        setOrders(data)
        const usersMap = await getUsersByIds(data.map(o => o.userId))
        setCustomers(usersMap)
      } catch (err) {
        setError('Error al cargar las órdenes')
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus)
      setOrders(prev => prev.map(o =>
        o.id === orderId ? { ...o, status: newStatus } : o
      ))
    } catch (err: any) {
      if (err?.code === 'permission-denied') {
        alert('No tenés permisos para cambiar el estado de las órdenes.')
      } else {
        alert('Error al actualizar el estado. Intentá de nuevo.')
      }
    }
  }

  const handleDelete = async (orderId: string) => {
    if (!confirm('¿Estás segura de eliminar esta orden? Esta acción no se puede deshacer.')) return
    try {
      setDeletingId(orderId)
      await deleteOrder(orderId)
      setOrders(prev => prev.filter(o => o.id !== orderId))
    } catch (err: any) {
      if (err?.code === 'permission-denied') {
        alert('No tenés permisos para eliminar órdenes.')
      } else {
        alert('Error al eliminar la orden. Intentá de nuevo.')
      }
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-glacier border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // --- Estadísticas reales, calculadas de las órdenes cargadas ---
  const totalOrders = orders.length
  const pendingCount = orders.filter(o => o.status === 'pending').length
  const completedCount = orders.filter(o => o.status === 'completed').length
  const cancelledCount = orders.filter(o => o.status === 'cancelled').length

  const searchLower = search.trim().toLowerCase()

  // Número de pedido real y persistente (asignado una sola vez al crear la
  // orden, vía contador en Firestore) — no se recalcula ni se puede repetir.
  const formatOrderNumber = (order: Order) =>
    order.orderNumber > 0 ? `PED-${order.orderNumber}` : `#${order.id.slice(0, 6).toUpperCase()}`

  const customerName = (order: Order) =>
    customers.get(order.userId)?.displayName || 'Usuario eliminado'

  const filteredOrders = orders
    .filter(o => statusFilter === 'todas' || o.status === statusFilter)
    .filter(o => {
      if (!searchLower) return true
      const num = formatOrderNumber(o).toLowerCase()
      const name = customerName(o).toLowerCase()
      return o.id.toLowerCase().includes(searchLower) || num.includes(searchLower) || name.includes(searchLower)
    })

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <h1 className="text-2xl font-bold text-stone">Pedidos</h1>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <p className="text-xs text-gray-500 mb-1">Total</p>
          <p className="text-lg font-bold text-stone">{totalOrders}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <p className="text-xs text-gray-500 mb-1">Pendientes</p>
          <p className="text-lg font-bold text-amber-600">{pendingCount}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <p className="text-xs text-gray-500 mb-1">Completadas</p>
          <p className="text-lg font-bold text-green-600">{completedCount}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <p className="text-xs text-gray-500 mb-1">Canceladas</p>
          <p className="text-lg font-bold text-red-500">{cancelledCount}</p>
        </div>
      </div>

      {/* Buscador + filtro */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por N° de pedido o cliente..."
            className="w-full bg-white border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:border-glacier"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as OrderStatus | 'todas')}
          className="border border-gray-200 bg-white text-stone rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-glacier"
        >
          <option value="todas">Todos los estados</option>
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-2xl shadow-sm">
          <p className="text-4xl mb-3">🧾</p>
          <p className="text-lg font-medium">
            {orders.length === 0 ? 'No hay pedidos' : 'Ningún pedido coincide con la búsqueda'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-3 text-left"></th>
                <th className="px-6 py-3 text-left">Pedido</th>
                <th className="px-6 py-3 text-left">Cliente</th>
                <th className="px-6 py-3 text-left">Productos</th>
                <th className="px-6 py-3 text-left">Total</th>
                <th className="px-6 py-3 text-left">Fecha</th>
                <th className="px-6 py-3 text-left">Estado</th>
                <th className="px-6 py-3 text-left"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map(order => {
                const status = STATUS_LABELS[order.status] ?? STATUS_LABELS.pending
                const isDeleting = deletingId === order.id
                const isExpanded = expandedId === order.id
                const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0)
                return (
                  <Fragment key={order.id}>
                    <tr
                      onClick={() => setExpandedId(isExpanded ? null : order.id)}
                      className="hover:bg-gray-50 transition cursor-pointer"
                    >
                      <td className="px-6 py-4 text-gray-400">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </td>
                      <td className="px-6 py-4 font-medium text-stone">
                        {formatOrderNumber(order)}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <User size={13} className="text-gray-400 shrink-0" />
                          <span className="truncate max-w-[140px]">{customerName(order)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
                      </td>
                      <td className="px-6 py-4 font-medium text-sunset">
                        ${order.total.toLocaleString('es-AR')}
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {order.createdAt instanceof Date
                          ? order.createdAt.toLocaleDateString('es-AR')
                          : ''}
                      </td>
                      <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                        <select
                          value={order.status}
                          onChange={e => handleStatusChange(order.id, e.target.value as OrderStatus)}
                          disabled={isDeleting}
                          className={`text-xs px-2 py-1 rounded-full font-medium border-0 cursor-pointer ${status.color}`}
                        >
                          {STATUS_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => handleDelete(order.id)}
                          disabled={isDeleting}
                          className="text-gray-300 hover:text-red-400 transition disabled:opacity-50"
                          aria-label="Eliminar orden"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${order.id}-detail`}>
                        <td colSpan={8} className="px-6 py-4 bg-white">
                          <div className="border border-gray-200 rounded-xl p-4 bg-fog/50">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-1.5 text-xs font-semibold text-stone">
                                <Package size={13} className="text-glacier" />
                                {formatOrderNumber(order)} · {customerName(order)}
                              </div>
                              <span className="text-xs text-gray-400">
                                {itemCount} {itemCount === 1 ? 'ítem' : 'ítems'}
                              </span>
                            </div>
                            <div className="flex flex-col gap-2">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 bg-white rounded-lg p-2.5 border border-gray-100">
                                  <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className="w-9 h-9 rounded-lg object-cover shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-stone truncate">{item.name}</p>
                                    <p className="text-xs text-gray-400">{item.category} · x{item.quantity}</p>
                                  </div>
                                  <span className="text-sm font-medium text-stone shrink-0">
                                    ${(item.unitPrice * item.quantity).toLocaleString('es-AR')}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}