import { Truck, RotateCcw, CreditCard, ShieldCheck } from 'lucide-react'
import { useSettings } from '../../contexts/settings'

export const LandingBenefits = () => {
  const { settings } = useSettings()

  const items = [
    {
      icon: Truck,
      title: 'Envíos a todo el país',
      subtitle: `Envío gratis desde $${settings.freeShippingThreshold.toLocaleString('es-AR')}`,
    },
    {
      icon: RotateCcw,
      title: 'Cambios durante 30 días',
      subtitle: 'Sin preguntas, sin complicaciones',
    },
    {
      icon: CreditCard,
      title: 'Hasta 6 cuotas',
      subtitle: 'Sin interés en productos seleccionados',
    },
    {
      icon: ShieldCheck,
      title: 'Productos originales',
      subtitle: 'Garantía oficial en todos los productos',
    },
  ]

  return (
    <div id="beneficios" className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map(item => (
          <div key={item.title} className="flex items-center gap-3">
            <item.icon size={22} className="text-glacier shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-stone truncate">{item.title}</p>
              <p className="text-xs text-gray-500 truncate">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}