import heroBg from '../../assets/hiker-sunset.jpg'
import { ArrowRight, Truck, ShieldCheck, RotateCcw, Headphones } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../routes/routes'
import { useSettings } from '../../contexts/settings'

export const Hero = () => {
  const { settings } = useSettings()

  const BENEFITS = [
    { icon: Truck, title: 'Envío a todo el país', subtitle: `Gratis en compras +$${settings.freeShippingThreshold.toLocaleString('es-AR')}` },
    { icon: ShieldCheck, title: 'Pago seguro', subtitle: 'Hasta 6 cuotas sin interés' },
    { icon: RotateCcw, title: 'Cambios fáciles', subtitle: '30 días para cambios' },
    { icon: Headphones, title: 'Atención personalizada', subtitle: 'Soporte 24/7' },
  ]

  const scrollToCatalog = () => {
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="overflow-hidden relative text-white">
      {/* Capa 1: la foto */}
      <div
        className="absolute inset-0 bg-cover"
        style={{ backgroundImage: `url(${heroBg})`, backgroundPosition: 'center 30%', zIndex: 0 }}
      />

      {/* Capa 2: overlay oscuro para legibilidad del texto */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          background: 'linear-gradient(90deg, rgba(15,17,20,0.85) 0%, rgba(15,17,20,0.55) 45%, rgba(15,17,20,0.15) 75%)',
        }}
      />

      {/* Capa 3: contenido */}
      <div className="relative max-w-7xl mx-auto px-6 md:px-16 py-10 md:py-14" style={{ zIndex: 2 }}>
        <h1 className="leading-none mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          <span className="block text-4xl md:text-6xl font-bold text-white">La aventura</span>
          <span className="block text-4xl md:text-6xl font-bold text-sunset -mt-1">empieza acá</span>
        </h1>

        <p className="text-sm md:text-base text-stone-200 mt-3 mb-6 max-w-sm leading-relaxed">
          Equipamiento premium para trekking, camping y todas tus aventuras.
        </p>

        <div className="flex flex-wrap items-center gap-3 mb-6 md:mb-8">
          <button
            onClick={scrollToCatalog}
            className="inline-flex items-center gap-2 bg-sunset text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition"
          >
            Explorar catálogo
            <ArrowRight size={16} />
          </button>
          <Link
            to={ROUTES.ABOUT}
            className="inline-block border border-white/70 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-white/10 transition"
          >
            Conocé {settings.storeName}
          </Link>
        </div>

        {/* Beneficios, escritos directamente sobre la foto, bien juntos */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 pt-4 border-t border-white/15">
          {BENEFITS.map(benefit => (
            <div key={benefit.title} className="flex items-center gap-2">
              <benefit.icon size={18} className="text-amber-100 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{benefit.title}</p>
                <p className="text-[11px] text-gray-300 truncate">{benefit.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}