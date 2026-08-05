import { useState, useEffect } from 'react'
import { Search, Mail, ShieldCheck, User as UserIcon } from 'lucide-react'
import { getAllUsers } from '../../services/users.service'
import { getAllOrders } from '../../services/orders.service'
import type { AppUser } from '../../types'

export const AdminUsersPage = () => {
  const [users, setUsers] = useState<AppUser[]>([])
  const [orderCounts, setOrderCounts] = useState<Map<string, number>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true)
        const [usersData, ordersData] = await Promise.all([
          getAllUsers(),
          getAllOrders(),
        ])
        setUsers(usersData)

        const counts = new Map<string, number>()
        ordersData.forEach(order => {
          counts.set(order.userId, (counts.get(order.userId) ?? 0) + 1)
        })
        setOrderCounts(counts)
      } catch (err) {
        setError('Error al cargar los usuarios')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-glacier border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const searchLower = search.trim().toLowerCase()
  const filteredUsers = users.filter(u =>
    !searchLower ||
    u.displayName.toLowerCase().includes(searchLower) ||
    u.email.toLowerCase().includes(searchLower)
  )

  const adminCount = users.filter(u => u.role === 'admin').length
  const customerCount = users.filter(u => u.role === 'customer').length

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone mb-5">Usuarios</h1>

      {/* Estadísticas */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <p className="text-xs text-gray-500 mb-1">Total</p>
          <p className="text-lg font-bold text-stone">{users.length}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <p className="text-xs text-gray-500 mb-1">Administradores</p>
          <p className="text-lg font-bold text-purple-600">{adminCount}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <p className="text-xs text-gray-500 mb-1">Clientes</p>
          <p className="text-lg font-bold text-blue-600">{customerCount}</p>
        </div>
      </div>

      {/* Buscador */}
      <div className="relative max-w-md mb-4">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nombre o email..."
          className="w-full bg-white border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:border-glacier"
        />
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {filteredUsers.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-2xl shadow-sm">
          <p className="text-4xl mb-3">👤</p>
          <p className="text-lg font-medium">
            {users.length === 0 ? 'No hay usuarios todavía' : 'Ningún usuario coincide con la búsqueda'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-3 text-left">Usuario</th>
                <th className="px-6 py-3 text-left">Rol</th>
                <th className="px-6 py-3 text-left">Pedidos</th>
                <th className="px-6 py-3 text-left">Miembro desde</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map(u => (
                <tr key={u.uid} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-full bg-fog flex items-center justify-center shrink-0">
                        <UserIcon size={16} className="text-glacier" />
                      </span>
                      <div className="min-w-0">
                        <p className="font-medium text-stone truncate">{u.displayName || 'Sin nombre'}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1 truncate">
                          <Mail size={11} className="shrink-0" />
                          {u.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1 w-fit text-xs px-2 py-1 rounded-full font-medium ${
                      u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {u.role === 'admin' && <ShieldCheck size={11} />}
                      {u.role === 'admin' ? 'Administrador' : 'Cliente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {orderCounts.get(u.uid) ?? 0}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs">
                    {u.createdAt.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}