import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/auth'
import { ROUTES } from '../../routes/routes'

export const RegisterPage = () => {
  const { register, loginWithGoogle, error, loading } = useAuth()
  const navigate = useNavigate()

  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    if (password !== confirmPassword) {
      setLocalError('Las contraseñas no coinciden')
      return
    }

    if (password.length < 6) {
      setLocalError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    await register(email, password, displayName)
    if (!error) navigate(ROUTES.PRODUCTS)
  }

  const handleGoogle = async () => {
    await loginWithGoogle()
    if (!error) navigate(ROUTES.PRODUCTS)
  }

  return (
    <div className="min-h-screen bg-sand flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">

        {/* Logo */}
        <h1 className="text-3xl font-bold text-navy text-center mb-2">Patagonix</h1>
        <p className="text-center text-gray-500 mb-6">Creá tu cuenta</p>

        {/* Errores */}
        {(error || localError) && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded mb-4">
            {localError || error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Nombre</label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="Tu nombre"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-teal"
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
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-teal"
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
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-teal"
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
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-teal"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-navy text-white py-2 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </button>
        </form>

        {/* Divisor */}
        <div className="flex items-center gap-3 my-4">
          <hr className="flex-1 border-gray-200" />
          <span className="text-xs text-gray-400">o continuá con</span>
          <hr className="flex-1 border-gray-200" />
        </div>

        {/* Google */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full border border-gray-300 rounded-lg py-2 text-sm font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
          Continuar con Google
        </button>

        {/* Login */}
        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Ya tenés cuenta?{' '}
          <Link to={ROUTES.LOGIN} className="text-teal font-semibold hover:underline">
            Ingresá
          </Link>
        </p>

      </div>
    </div>
  )
}