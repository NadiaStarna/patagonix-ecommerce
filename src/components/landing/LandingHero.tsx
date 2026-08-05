import heroBg from '../../assets/hiker-sunset.jpg'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../routes/routes'

export const LandingHero = () => {
  const navigate = useNavigate()

  const scrollToNext = () => {
    document.getElementById('beneficios')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="overflow-hidden relative text-white">
      <div
        className="absolute inset-0 bg-cover"
        style={{ backgroundImage: `url(${heroBg})`, backgroundPosition: 'center 25%', zIndex: 0 }}
      />
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          background: 'linear-gradient(90deg, rgba(13,27,42,0.92) 0%, rgba(13,27,42,0.6) 45%, rgba(13,27,42,0.15) 75%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-16 py-20 md:py-28" style={{ zIndex: 2 }}>
        <span className="text-sunset text-xs font-semibold tracking-widest uppercase">
          Equipamiento premium
        </span>
        <h1 className="leading-[0.95] my-3" style={{ fontFamily: 'var(--font-display)' }}>
          <span className="block text-4xl md:text-6xl font-bold text-white">Equipamiento para</span>
          <span className="block text-4xl md:text-6xl font-bold text-white">desafiar el frío</span>
        </h1>
        <p className="text-sm md:text-base text-gray-300 mb-8 max-w-md leading-relaxed">
          Equipamiento premium para montaña, trekking, nieve y aventuras extremas.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigate(ROUTES.PRODUCTS, { state: { scrollToCatalog: true } })}
            className="inline-flex items-center gap-2 bg-sunset text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition"
          >
            Explorar catálogo
            <ArrowRight size={16} />
          </button>
          <button
            onClick={() => navigate(ROUTES.PRODUCTS, { state: { scrollToCatalog: true } })}
            className="inline-block border border-white/70 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-white/10 transition"
          >
            Ver novedades
          </button>
        </div>

        <button
          onClick={scrollToNext}
          className="hidden md:flex items-center gap-2 text-xs text-gray-400 hover:text-white transition mt-16"
        >
          Scroll para descubrir
          <ChevronDown size={14} className="animate-bounce" />
        </button>
      </div>
    </div>
  )
}