import { useState } from 'react'
import { useSettings } from '../../contexts/settings'

export const LandingNewsletter = () => {
  const { settings } = useSettings()
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Todavía no conectamos el newsletter a un servicio de mail real — por ahora esto es solo una demo visual.')
    setEmail('')
  }

  return (
    <div className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>
            No vendemos ropa.<br />Vendemos aventuras.
          </h2>
          <p className="text-xs text-gray-400">
            Recibí lanzamientos exclusivos, ofertas y guías para tus próximas expediciones de {settings.storeName}.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex w-full md:w-auto gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Tu correo electrónico"
            className="flex-1 md:w-64 bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:border-sunset"
          />
          <button
            type="submit"
            className="bg-sunset text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition whitespace-nowrap"
          >
            Suscribirme
          </button>
        </form>
      </div>
      <p className="text-center text-[11px] text-gray-500 pb-4">No enviamos spam. Podés darte de baja cuando quieras.</p>
    </div>
  )
}