import { Link } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar'
import { useSettings } from '../contexts/settings'
import { ROUTES } from '../routes/routes'

interface MainLayoutProps {
  children: React.ReactNode
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { settings } = useSettings()

  return (
    <div className="min-h-screen bg-fog flex flex-col">

      {/* Navbar siempre arriba */}
      <Navbar />

      {/* Contenido de la página */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Footer */}
      <footer id="contacto" className="bg-stone text-white py-10 text-sm">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 text-center md:text-left">

          <div>
            <p className="font-semibold text-base mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              Sobre {settings.storeName}
            </p>
            <p className="text-gray-300 leading-relaxed mb-2">
              Equipamiento premium para trekking, camping y todas tus aventuras en la Patagonia argentina.
            </p>
            <Link to={ROUTES.ABOUT} className="text-sunset text-sm hover:underline">
              Conocé más sobre nosotros →
            </Link>
          </div>

          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="font-semibold">¿Necesitás ayuda?</p>
            <p className="text-gray-300">{settings.contactEmail}</p>
            <p className="text-gray-300">{settings.contactPhone}</p>
          </div>

        </div>
        <p className="text-gray-400 text-xs text-center mt-8">© 2026 {settings.storeName} — Todos los derechos reservados</p>
      </footer>

    </div>
  )
}