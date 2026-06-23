import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/auth'
import { ROUTES } from '../../routes/routes'
import { Mountain } from 'lucide-react'

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
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(180deg, #4A2E4A 0%, #B05A3A 45%, #2B2E33 100%)' }}
    >
      <div className="bg-fog rounded-2xl shadow-lg w-full max-w-md p-8">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <Mountain size={22} className="text-sunset" />
          <h1 className="text-3xl font-bold text-stone" style={{ fontFamily: 'var(--font-display)' }}>
            Patagonix
          </h1>
        </div>
        <p className="text-center text-gray-500 mb-6">Ingresá a tu cuenta</p>

        {formError && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded mb-4">
            {formError}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              disabled={loading}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-glacier disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-glacier disabled:bg-gray-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-stone text-white py-2 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-4">
          <hr className="flex-1 border-gray-300" />
          <span className="text-xs text-gray-500">o continuá con</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full bg-white border border-gray-300 rounded-lg py-2 text-sm font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
          Continuar con Google
        </button>

        <p className="text-center text-sm text-gray-500 mt-6">
          ¿No tenés cuenta?{' '}
          <Link to={ROUTES.REGISTER} className="text-glacier font-semibold hover:underline">
            Registrate
          </Link>
        </p>

      </div>
    </div>
  )
}