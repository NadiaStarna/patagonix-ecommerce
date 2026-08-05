import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Tent, Mountain, Shirt, Cpu, Backpack, ArrowRight } from 'lucide-react'
import { getProducts } from '../../services/products.service'
import { ROUTES } from '../../routes/routes'
import type { Product, ProductCategory } from '../../types'

const CATEGORY_META: { value: ProductCategory; label: string; icon: typeof Tent }[] = [
  { value: 'trekking', label: 'Trekking', icon: Mountain },
  { value: 'camping', label: 'Camping', icon: Tent },
  { value: 'indumentaria', label: 'Indumentaria', icon: Shirt },
  { value: 'tecnologia', label: 'Tecnología', icon: Cpu },
  { value: 'accesorios', label: 'Accesorios', icon: Backpack },
]

export const AdminCategoriesPage = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts()
        setProducts(data)
      } catch {
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-glacier border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const goToCategory = (category: ProductCategory) => {
    navigate(`${ROUTES.ADMIN_PRODUCTS}?category=${category}`)
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-stone">Categorías</h1>
        <p className="text-sm text-gray-500 mt-1">
          Las categorías son fijas (definidas en el modelo de datos) — acá ves cómo está repartido tu catálogo entre ellas.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORY_META.map(cat => {
          const categoryProducts = products.filter(p => p.category === cat.value)
          const totalStock = categoryProducts.reduce((sum, p) => sum + p.stock, 0)
          const totalValue = categoryProducts.reduce((sum, p) => sum + p.price * p.stock, 0)
          const lowStockCount = categoryProducts.filter(p => p.stock > 0 && p.stock <= 10).length

          return (
            <button
              key={cat.value}
              onClick={() => goToCategory(cat.value)}
              className="bg-white rounded-2xl shadow-sm p-5 text-left hover:shadow-md transition group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="w-11 h-11 rounded-xl bg-fog flex items-center justify-center">
                  <cat.icon size={20} className="text-glacier" />
                </span>
                <ArrowRight size={16} className="text-gray-300 group-hover:text-sunset group-hover:translate-x-0.5 transition" />
              </div>
              <h2 className="font-bold text-stone mb-3">{cat.label}</h2>
              <div className="flex flex-col gap-1.5 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Productos</span>
                  <span className="font-medium text-stone">{categoryProducts.length}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Stock total</span>
                  <span className="font-medium text-stone">{totalStock} unidades</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Valor en inventario</span>
                  <span className="font-medium text-sunset">${totalValue.toLocaleString('es-AR')}</span>
                </div>
                {lowStockCount > 0 && (
                  <div className="flex justify-between text-red-500">
                    <span>Stock bajo</span>
                    <span className="font-medium">{lowStockCount}</span>
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}