// src/pages/auth/RegisterPage.tsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/auth'
import { ROUTES } from '../../routes/routes'
import { Mountain } from 'lucide-react'

export const RegisterPage = () => {
  const { register, loginWithGoogle, loading } = useAuth()
  const navigate = useNavigate()

  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  const validateForm = (): string | null => {
    if (displayName.trim().length < 2) {
      return 'El nombre debe tener al menos 2 caracteres'
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return 'Ingresá un email válido'
    }
    if (password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres'
    }
    if (password !== confirmPassword) {
      return 'Las contraseñas no coinciden'
    }
    return null
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    const validationError = validateForm()
    if (validationError) {
      setFormError(validationError)
      return
    }
    try {
      await register(email, password, displayName)
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
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ background: 'linear-gradient(180deg, #4A2E4A 0%, #B05A3A 45%, #2B2E33 100%)' }}
    >
      <div className="bg-fog rounded-2xl shadow-lg w-full max-w-md p-8">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-1">
          <Mountain size={22} className="text-sunset" />
          <h1 className="text-2xl font-bold text-stone" style={{ fontFamily: 'var(--font-display)' }}>
            Patagonix
          </h1>
        </div>
        <p className="text-center text-gray-500 mb-4 text-sm">Creá tu cuenta</p>

        {formError && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded mb-3">
            {formError}
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-3">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Nombre</label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="Tu nombre"
              required
              disabled={loading}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-glacier disabled:bg-gray-100"
            />
          </div>

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

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Confirmar contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-glacier disabled:bg-gray-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-stone text-white py-2 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition disabled:opacity-50 mt-1"
          >
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-3">
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

        <p className="text-center text-sm text-gray-500 mt-4">
          ¿Ya tenés cuenta?{' '}
          <Link to={ROUTES.LOGIN} className="text-glacier font-semibold hover:underline">
            Ingresá
          </Link>
        </p>

      </div>
    </div>
  )
}