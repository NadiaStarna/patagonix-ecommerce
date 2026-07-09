import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/auth'
import { ROUTES } from '../../routes/routes'
import { Mountain } from 'lucide-react'
import loginBg from '../../assets/login-bg.jpg'

export const LoginPage = () => {
  const { login, loginWithGoogle, loading } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    try {
      await login(email, password)
      navigate(ROUTES.PRODUCTS)
    } catch (err: any) {
      setFormError(err.message)
    }
  }

  const handleGoogle = async () => {
    setFormError(null)
    try {
      await loginWithGoogle()
      navigate(ROUTES.PRODUCTS)
    } catch (err: any) {
      setFormError(err.message)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative bg-cover bg-center"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      {/* Overlay con degradé de marca para legibilidad y coherencia visual */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(74,46,74,0.55) 0%, rgba(176,90,58,0.45) 45%, rgba(43,46,51,0.75) 100%)',
        }}
      />

      {/* Tarjeta glassmorphism */}
      <div className="relative z-10 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl w-full max-w-md p-8">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <Mountain size={22} className="text-[#E8A464]" />
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
            Patagonix
          </h1>
        </div>
        <p className="text-center text-white/70 mb-6">Ingresá a tu cuenta</p>

        {formError && (
          <div className="bg-red-500/20 border border-red-400/40 text-red-100 text-sm px-4 py-2 rounded mb-4">
            {formError}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-white/80 mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              disabled={loading}
              className="w-full bg-white/10 border border-white/30 text-white placeholder-white/50 rounded-lg px-4 py-2 text-sm backdrop-blur-sm focus:outline-none focus:border-white/70 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="text-sm text-white/80 mb-1 block">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
              className="w-full bg-white/10 border border-white/30 text-white placeholder-white/50 rounded-lg px-4 py-2 text-sm backdrop-blur-sm focus:outline-none focus:border-white/70 disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="text-white py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50"
            style={{ background: '#C96B44' }}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-4">
          <hr className="flex-1 border-white/20" />
          <span className="text-xs text-white/60">o continuá con</span>
          <hr className="flex-1 border-white/20" />
        </div>

        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full bg-white/90 border border-white/40 rounded-lg py-2 text-sm font-medium hover:bg-white transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
          Continuar con Google
        </button>

        <p className="text-center text-sm text-white/70 mt-6">
          ¿No tenés cuenta?{' '}
          <Link to={ROUTES.REGISTER} className="text-[#E8A464] font-semibold hover:underline">
            Registrate
          </Link>
        </p>

      </div>
    </div>
  )
}