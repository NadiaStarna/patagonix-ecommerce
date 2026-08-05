import { Award, Mountain, ShieldCheck } from 'lucide-react'
import { useSettings } from '../../contexts/settings'

const STEPS = [
  { icon: Award, title: 'Elegimos materiales premium', description: 'Trabajamos con las mejores marcas del mundo.' },
  { icon: Mountain, title: 'Probamos cada producto', description: 'Tested by adventurers en condiciones extremas.' },
  { icon: ShieldCheck, title: 'Garantía oficial', description: 'Todos nuestros productos cuentan con garantía.' },
]

export const LandingWhyUs = () => {
  const { settings } = useSettings()

  return (
    <div className="bg-fog">
      <div className="max-w-7xl mx-auto px-4 py-14">
        <span className="text-sunset text-xs font-semibold tracking-widest uppercase">¿Por qué elegir {settings.storeName}?</span>
        <h2 className="text-2xl md:text-3xl font-bold text-stone mt-1 mb-8" style={{ fontFamily: 'var(--font-display)' }}>
          Calidad, confianza y aventura
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {STEPS.map((step, idx) => (
            <div key={step.title} className="relative bg-white rounded-2xl shadow-sm p-5">
              <span className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-sunset text-white text-xs font-bold flex items-center justify-center">
                {idx + 1}
              </span>
              <span className="w-11 h-11 rounded-xl bg-fog flex items-center justify-center mb-3">
                <step.icon size={20} className="text-glacier" />
              </span>
              <h3 className="font-bold text-stone text-sm mb-1">{step.title}</h3>
              <p className="text-xs text-gray-500">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}