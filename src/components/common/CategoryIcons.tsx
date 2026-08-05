import { ArrowRight } from 'lucide-react'
import { useProducts } from '../../contexts/products'
import { CATEGORIES } from '../../utils/categories'

export const CategoryIcons = () => {
  const { selectedCategory, setSelectedCategory } = useProducts()

  const handleSelect = (value: (typeof CATEGORIES)[number]['value']) => {
    setSelectedCategory(value)
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleVerTodas = () => {
    setSelectedCategory('todas')
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3 overflow-x-auto">
        {CATEGORIES.map(cat => {
          const active = selectedCategory === cat.value
          return (
            <button
              key={cat.value}
              onClick={() => handleSelect(cat.value)}
              className={`flex items-center gap-2 shrink-0 border rounded-full pl-2.5 pr-4 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'bg-navy border-navy text-white'
                  : 'bg-white border-gray-200 text-stone hover:border-navy/40'
              }`}
            >
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  active ? 'bg-white/15' : 'bg-fog'
                }`}
              >
                <cat.icon size={14} className={active ? 'text-white' : 'text-navy'} />
              </span>
              {cat.label}
            </button>
          )
        })}

        <button
          onClick={handleVerTodas}
          className="flex items-center gap-2 shrink-0 border border-sunset bg-sunset text-white rounded-full pl-2.5 pr-4 py-2 text-sm font-medium hover:bg-opacity-90 transition"
        >
          <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center shrink-0">
            <ArrowRight size={14} />
          </span>
          Ver todas
        </button>
      </div>
    </div>
  )
}