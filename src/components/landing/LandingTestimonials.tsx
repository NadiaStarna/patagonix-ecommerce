import { Star } from 'lucide-react'

// Contenido de ejemplo — no son reseñas reales de clientes.
const TESTIMONIALS = [
  { name: 'Juan M.', location: 'Neuquén', rating: 5, text: 'Subí el Lanín usando la mochila 50L y fue increíble. Cómoda, resistente y con mucho espacio.' },
  { name: 'María L.', location: 'Mendoza', rating: 5, text: 'La campera soportó nieve y viento durante todo el viaje. 100% recomendada.' },
  { name: 'Pablo R.', location: 'Bariloche', rating: 4, text: 'Excelente calidad en todos los productos. Se nota que aman lo que hacen.' },
]

export const LandingTestimonials = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-14">
      <span className="text-sunset text-xs font-semibold tracking-widest uppercase">Lo que dicen nuestros clientes</span>
      <h2 className="text-2xl md:text-3xl font-bold text-stone mt-1 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
        Historias que inspiran
      </h2>
      <p className="text-xs text-gray-400 mb-8">Reseñas de ejemplo, con fines ilustrativos.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {TESTIMONIALS.map(t => (
          <div key={t.name} className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} className={i < t.rating ? 'fill-sunset text-sunset' : 'text-gray-200'} />
              ))}
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">"{t.text}"</p>
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-fog flex items-center justify-center text-xs font-semibold text-glacier shrink-0">
                {t.name[0]}
              </span>
              <div>
                <p className="text-xs font-semibold text-stone">{t.name}</p>
                <p className="text-[11px] text-gray-400">{t.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}