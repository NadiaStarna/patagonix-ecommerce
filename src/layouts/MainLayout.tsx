import { Navbar } from '../components/layout/Navbar'

interface MainLayoutProps {
  children: React.ReactNode
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-fog flex flex-col">

      {/* Navbar siempre arriba */}
      <Navbar />

      {/* Contenido de la página */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-stone text-white text-center py-4 text-sm">
        © 2026 Patagonix — Todos los derechos reservados
      </footer>

    </div>
  )
}