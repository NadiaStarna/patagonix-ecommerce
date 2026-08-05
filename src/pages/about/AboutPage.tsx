import { Link, useNavigate } from 'react-router-dom'
import { Mountain, Truck, ShieldCheck, RotateCcw, Headphones, Tent, Backpack, ArrowLeft } from 'lucide-react'
import { ROUTES } from '../../routes/routes'
import heroBg from '../../assets/login-bg.jpg'

export const AboutPage = () => {
  const navigate = useNavigate()

  return (
    <div>
      {/* Hero de la página */}
      <div className="relative overflow-hidden text-white">
        <div
          className="absolute inset-0 bg-cover"
          style={{ backgroundImage: `url(${heroBg})`, backgroundPosition: 'center 30%' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(90deg, rgba(15,17,20,0.88) 0%, rgba(15,17,20,0.6) 55%, rgba(15,17,20,0.25) 100%)' }}
        />
        <div className="relative max-w-4xl mx-auto px-6 py-16 md:py-20">
          <div className="flex items-center gap-2 mb-4">
            <Mountain size={22} className="text-sunset" />
            <span className="text-sm uppercase tracking-wider text-gray-300">Sobre nosotros</span>
          </div>
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-3xl md:text-5xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              Equipamos tu próxima aventura en la Patagonia
            </h1>
            <button
              onClick={() => navigate(-1)}
              className="hidden sm:flex items-center gap-1.5 text-sm border border-white/50 rounded-lg px-3 py-1.5 hover:bg-white/10 transition-colors shrink-0"
            >
              <ArrowLeft size={15} />
              Atrás
            </button>
          </div>
          <p className="text-gray-200 max-w-xl leading-relaxed">
            Nacimos de las ganas de recorrer la Patagonia argentina con el equipo justo.
            Desde Bariloche seleccionamos indumentaria y equipamiento de trekking y camping
            pensado para el frío, el viento y las distancias largas — para que lo único que
            tengas que planear sea el próximo destino.
          </p>
        </div>
      </div>

      {/* Qué encontrás en Patagonix */}
      <div className="max-w-4xl mx-auto px-6 py-14">
        <h2 className="text-2xl font-bold text-stone mb-3" style={{ fontFamily: 'var(--font-display)' }}>
          Qué encontrás en Patagonix
        </h2>
        <p className="text-gray-600 leading-relaxed mb-8">
          Patagonix es una tienda online pensada para quienes eligen la montaña, el camping
          y el trekking como forma de desconectar. Organizamos el catálogo en cinco categorías
          — camping, trekking, indumentaria, tecnología y accesorios — para que encuentres
          rápido lo que necesitás, con fichas de producto claras, stock actualizado y un
          checkout simple de principio a fin.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <Truck size={20} className="text-glacier shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-stone">Envío a todo el país</p>
              <p className="text-xs text-gray-500">Gratis en compras +$60.000</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheck size={20} className="text-glacier shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-stone">Pago seguro</p>
              <p className="text-xs text-gray-500">Hasta 6 cuotas sin interés</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <RotateCcw size={20} className="text-glacier shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-stone">Cambios fáciles</p>
              <p className="text-xs text-gray-500">30 días para cambios</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Headphones size={20} className="text-glacier shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-stone">Atención personalizada</p>
              <p className="text-xs text-gray-500">Soporte 24/7</p>
            </div>
          </div>
        </div>
      </div>

      {/* Franja destacada */}
      <div className="bg-white border-y border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex items-center gap-4">
            <span className="w-14 h-14 rounded-full bg-fog flex items-center justify-center shrink-0">
              <Tent size={24} className="text-glacier" />
            </span>
            <div>
              <p className="font-semibold text-stone">Equipamiento probado</p>
              <p className="text-sm text-gray-500">Seleccionado pensando en las condiciones reales de la Patagonia.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="w-14 h-14 rounded-full bg-fog flex items-center justify-center shrink-0">
              <Backpack size={24} className="text-glacier" />
            </span>
            <div>
              <p className="font-semibold text-stone">Para cada tipo de salida</p>
              <p className="text-sm text-gray-500">Desde una escapada de fin de semana hasta una travesía de varios días.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA final */}
      <div className="max-w-4xl mx-auto px-6 py-14 text-center">
        <h2 className="text-xl font-bold text-stone mb-3" style={{ fontFamily: 'var(--font-display)' }}>
          ¿Listo para tu próxima salida?
        </h2>
        <Link
          to={ROUTES.PRODUCTS}
          className="inline-flex items-center gap-2 bg-sunset text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition"
        >
          Ver catálogo
        </Link>
      </div>
    </div>
  )
}