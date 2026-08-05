import loginBg from '../../assets/glacier-hiker.jpg'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../routes/routes'

export const LandingBanner = () => {
  const navigate = useNavigate()

  return (
    <div className="relative overflow-hidden text-white">
      <div
        className="absolute inset-0 bg-cover"
        style={{ backgroundImage: `url(${loginBg})`, backgroundPosition: 'center 60%' }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy/85 via-navy/50 to-navy/10" />
      <div className="relative max-w-7xl mx-auto px-6 md:px-16 py-16 md:py-20">
        <h2 className="text-2xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          La naturaleza no espera.
        </h2>
        <p className="text-sm md:text-base text-gray-200 mb-6 max-w-sm">
          Descubrí productos preparados para temperaturas extremas.
        </p>
        <button
          onClick={() => navigate(ROUTES.PRODUCTS, { state: { scrollToCatalog: true } })}
          className="inline-flex items-center gap-2 bg-sunset text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition"
        >
          Explorar catálogo
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}