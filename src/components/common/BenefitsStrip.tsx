import { Truck, ShieldCheck, RotateCcw, Headphones } from 'lucide-react'

const BENEFITS = [
  { icon: Truck, title: 'Envío a todo el país', subtitle: 'Gratis en compras +$99.000' },
  { icon: ShieldCheck, title: 'Pago seguro', subtitle: 'Hasta 6 cuotas sin interés' },
  { icon: RotateCcw, title: 'Cambios fáciles', subtitle: '30 días para cambios' },
  { icon: Headphones, title: 'Atención personalizada', subtitle: 'Soporte 24/7' },
]

export const BenefitsStrip = () => {
  return (
    <div className="bg-navy">
      <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {BENEFITS.map(benefit => (
          <div key={benefit.title} className="flex items-center gap-2.5">
            <benefit.icon size={22} className="text-white shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{benefit.title}</p>
              <p className="text-[11px] text-white/70 truncate">{benefit.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}