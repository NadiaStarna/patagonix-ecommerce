import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// React Router no hace scroll al top al navegar entre rutas — mantiene
// la posición de scroll de la página anterior. Este componente arregla eso.
export const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}