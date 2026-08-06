import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ShoppingBag, ShoppingCart, Package, Users,
  Plus, ClipboardList, Ticket, BarChart3, AlertTriangle,
  Pencil, Trash2, User,
} from 'lucide-react'
import { useAuth } from '../../contexts/auth'
import { getProducts, deleteProduct } from '../../services/products.service'
import { getAllOrders } from '../../services/orders.service'
import { getUsersByIds } from '../../services/users.service'
import { ROUTES } from '../../routes/routes'
import type { Product, Order, AppUser } from '../../types'

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pendiente', color: 'bg-amber-100 text-amber-700' },
  processing: { label: 'En proceso', color: 'bg-blue-100 text-blue-600' },
  completed: { label: 'Entregado', color: 'bg-green-100 text-green-600' },
  cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-600' },
}

const LOW_STOCK_THRESHOLD = 10

export const AdminDashboardPage = () => {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Map<string, AppUser>>(new Map())
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [productsData, ordersData] = await Promise.all([
          getProducts(),
          getAllOrders(),
        ])
        setProducts(productsData)
        setOrders(ordersData)
        const usersMap = await getUsersByIds(ordersData.map(o => o.userId))
        setCustomers(usersMap)
      } catch {
        setProducts([])
        setOrders([])
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const handleDeleteProduct = async (id: string, name: string) => {
    if (user?.role === 'demo') {
      alert('Estás en modo demo (solo lectura) — no se pueden eliminar productos con esta cuenta.')
      return
    }
    if (!confirm(`¿Estás segura de eliminar "${name}"?`)) return
    try {
      setDeletingId(id)
      await deleteProduct(id)
      setProducts(prev => prev.filter(p => p.id !== id))
    } catch (err: any) {
      if (err?.code === 'permission-denied') {
        alert('No tenés permisos para eliminar productos.')
      } else {
        alert('Error al eliminar el producto. Intentá de nuevo.')
      }
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-10 h-10 border-4 border-glacier border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const firstName = user?.displayName?.split(' ')[0] ?? ''

  // --- Datos reales, calculados de Firestore ---
  const totalVentas = orders.reduce((sum, o) => sum + o.total, 0)
  const totalPedidos = orders.length
  const totalProductos = products.length
  const lowStock = [...products]
    .filter(p => p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD)
    .sort((a, b) => a.stock - b.stock)
  const recentProducts = [...products]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  const recentOrders = orders

  // Mismo número de pedido real y persistente que en la pantalla de Pedidos
  // (asignado una sola vez al crear la orden, nunca se recicla).
  const formatOrderNumber = (order: Order) =>
    order.orderNumber > 0 ? `PED-${order.orderNumber}` : `#${order.id.slice(0, 6).toUpperCase()}`

  const customerName = (order: Order) =>
    customers.get(order.userId)?.displayName || 'Usuario eliminado'

  // --- Dato de mentira: no tenemos una colección de usuarios accesible desde acá ---
  const totalUsuarios = 148

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone">¡Hola, {firstName}! 👋</h1>
          <p className="text-sm text-gray-500">Este es el resumen de tu tienda.</p>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
              <ShoppingBag size={15} className="text-sunset" />
            </span>
            <span className="text-xs text-gray-500">Ventas totales</span>
          </div>
          <p className="text-lg font-bold text-stone">${totalVentas.toLocaleString('es-AR')}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
              <ShoppingCart size={15} className="text-blue-600" />
            </span>
            <span className="text-xs text-gray-500">Pedidos</span>
          </div>
          <p className="text-lg font-bold text-stone">{totalPedidos}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
              <Package size={15} className="text-moss" />
            </span>
            <span className="text-xs text-gray-500">Productos</span>
          </div>
          <p className="text-lg font-bold text-stone">{totalProductos}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
              <Users size={15} className="text-purple-600" />
            </span>
            <span className="text-xs text-gray-500">Usuarios</span>
          </div>
          <p className="text-lg font-bold text-stone">{totalUsuarios}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Dato de ejemplo</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">

        {/* Últimos pedidos */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-stone">Últimos pedidos</h2>
            <Link to={ROUTES.ADMIN_ORDERS} className="text-xs text-sunset hover:underline">Ver todos</Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Todavía no hay pedidos.</p>
          ) : (
            <div className="overflow-x-auto overflow-y-auto max-h-52">
              <table className="w-full text-sm min-w-[560px]">
                <thead className="text-gray-400 text-xs uppercase sticky top-0 bg-white">
                  <tr>
                    <th className="text-left py-2">Pedido</th>
                    <th className="text-left py-2">Cliente</th>
                    <th className="text-left py-2">Estado</th>
                    <th className="text-left py-2">Total</th>
                    <th className="text-left py-2">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentOrders.map(order => {
                    const status = STATUS_LABELS[order.status] ?? STATUS_LABELS.pending
                    return (
                      <tr key={order.id}>
                        <td className="py-2.5 font-medium text-stone">{formatOrderNumber(order)}</td>
                        <td className="py-2.5 text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <User size={12} className="text-gray-400 shrink-0" />
                            <span className="truncate max-w-[110px]">{customerName(order)}</span>
                          </div>
                        </td>
                        <td className="py-2.5">
                          <span className={`text-xs px-2 py-1 rounded-full ${status.color}`}>{status.label}</span>
                        </td>
                        <td className="py-2.5 font-medium text-stone">${order.total.toLocaleString('es-AR')}</td>
                        <td className="py-2.5 text-gray-500">
                          {order.createdAt.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stock bajo */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-stone flex items-center gap-1.5">
              <AlertTriangle size={16} className="text-sunset" />
              Stock bajo
            </h2>
            <Link to={ROUTES.ADMIN_PRODUCTS} className="text-xs text-sunset hover:underline">Ver inventario</Link>
          </div>
          {lowStock.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Ningún producto con stock bajo.</p>
          ) : (
            <div className="flex flex-col gap-3 overflow-y-auto max-h-52 pr-1">
              {lowStock.map(product => (
                <div key={product.id} className="flex items-center gap-3">
                  <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone truncate">{product.name}</p>
                    <p className="text-xs text-gray-400">{product.category}</p>
                  </div>
                  <span className="text-xs font-semibold text-red-500 shrink-0">{product.stock} unidades</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Productos recientes */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-stone">Productos recientes</h2>
            <Link to={ROUTES.ADMIN_PRODUCTS} className="text-xs text-sunset hover:underline">Ver todos</Link>
          </div>
          {recentProducts.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Todavía no hay productos.</p>
          ) : (
            <div className="overflow-x-auto overflow-y-auto max-h-80">
              <table className="w-full text-sm min-w-[560px]">
                <thead className="text-gray-400 text-xs uppercase sticky top-0 bg-white">
                  <tr>
                    <th className="text-left py-2">Producto</th>
                    <th className="text-left py-2">Categoría</th>
                    <th className="text-left py-2">Precio</th>
                    <th className="text-left py-2">Stock</th>
                    <th className="text-left py-2">Estado</th>
                    <th className="text-left py-2">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentProducts.map(product => {
                    const isDeleting = deletingId === product.id
                    return (
                      <tr key={product.id}>
                        <td className="py-2.5">
                          <div className="flex items-center gap-2.5">
                            <img src={product.imageUrl} alt={product.name} className="w-9 h-9 rounded-lg object-cover" />
                            <span className="font-medium text-stone truncate max-w-[140px]">{product.name}</span>
                          </div>
                        </td>
                        <td className="py-2.5 text-gray-500">{product.category}</td>
                        <td className="py-2.5 font-medium text-sunset">${product.price.toLocaleString('es-AR')}</td>
                        <td className="py-2.5">{product.stock} unidades</td>
                        <td className="py-2.5">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            product.stock > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                          }`}>
                            {product.stock > 0 ? 'Activo' : 'Sin stock'}
                          </span>
                        </td>
                        <td className="py-2.5">
                          <div className="flex items-center gap-3">
                            <Link
                              to={ROUTES.ADMIN_PRODUCT_EDIT.replace(':id', product.id)}
                              className="text-glacier hover:text-glacier/70 transition"
                              aria-label="Editar producto"
                            >
                              <Pencil size={15} />
                            </Link>
                            <button
                              onClick={() => handleDeleteProduct(product.id, product.name)}
                              disabled={isDeleting}
                              className="text-gray-300 hover:text-red-400 transition disabled:opacity-50"
                              aria-label="Eliminar producto"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Acciones rápidas */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="font-bold text-stone mb-4">Acciones rápidas</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to={ROUTES.ADMIN_PRODUCT_NEW}
              className="flex flex-col items-center justify-center gap-1.5 bg-orange-100 rounded-lg py-4 hover:bg-orange-200 transition"
            >
              <Plus size={18} className="text-sunset" />
              <span className="text-xs font-medium text-stone text-center">Agregar producto</span>
            </Link>
            <Link
              to={ROUTES.ADMIN_ORDERS}
              className="flex flex-col items-center justify-center gap-1.5 bg-blue-100 rounded-lg py-4 hover:bg-blue-200 transition"
            >
              <ClipboardList size={18} className="text-blue-600" />
              <span className="text-xs font-medium text-stone text-center">Gestionar pedidos</span>
            </Link>
            <button
              disabled
              title="Todavía no implementado"
              className="flex flex-col items-center justify-center gap-1.5 bg-gray-100 rounded-lg py-4 cursor-not-allowed"
            >
              <Ticket size={18} className="text-gray-400" />
              <span className="text-xs font-medium text-gray-400 text-center">Crear cupón</span>
            </button>
            <button
              disabled
              title="Todavía no implementado"
              className="flex flex-col items-center justify-center gap-1.5 bg-gray-100 rounded-lg py-4 cursor-not-allowed"
            >
              <BarChart3 size={18} className="text-gray-400" />
              <span className="text-xs font-medium text-gray-400 text-center">Ver reportes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}