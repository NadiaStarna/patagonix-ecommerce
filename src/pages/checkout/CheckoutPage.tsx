// src/pages/checkout/CheckoutPage.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, Landmark, Banknote, MapPin, ArrowLeft } from 'lucide-react'
import { useCart } from '../../contexts/cart'
import { useAuth } from '../../contexts/auth'
import { useSettings } from '../../contexts/settings'
import { createOrder } from '../../services/orders.service'
import { ROUTES } from '../../routes/routes'
import type { OrderItem } from '../../types'

type PaymentMethod = 'tarjeta' | 'transferencia' | 'efectivo'

const PAYMENT_METHODS: { value: PaymentMethod; label: string; description: string; icon: typeof CreditCard }[] = [
  { value: 'tarjeta', label: 'Tarjeta de crédito o débito', description: 'Hasta 6 cuotas sin interés', icon: CreditCard },
  { value: 'transferencia', label: 'Transferencia bancaria', description: 'Acreditación en 24-48hs', icon: Landmark },
  { value: 'efectivo', label: 'Efectivo al retirar', description: 'Pagás al buscar tu pedido', icon: Banknote },
]

export const CheckoutPage = () => {
  const { items, itemCount, clearCart } = useCart()
  const { user } = useAuth()
  const { settings } = useSettings()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('tarjeta')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [shipping, setShipping] = useState({
    fullName: user?.displayName ?? '',
    address: '',
    city: '',
    postalCode: '',
  })
  const [shippingErrors, setShippingErrors] = useState<Record<string, boolean>>({})

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const freeShipping = subtotal >= settings.freeShippingThreshold
  const shippingCost = freeShipping ? 0 : settings.shippingCost
  const total = subtotal + shippingCost

  const handleShippingChange = (field: keyof typeof shipping, value: string) => {
    setShipping(prev => ({ ...prev, [field]: value }))
    if (shippingErrors[field]) {
      setShippingErrors(prev => ({ ...prev, [field]: false }))
    }
  }

  const validateShipping = (): boolean => {
    const errors: Record<string, boolean> = {}
    if (!shipping.fullName.trim()) errors.fullName = true
    if (!shipping.address.trim()) errors.address = true
    if (!shipping.city.trim()) errors.city = true
    if (!shipping.postalCode.trim()) errors.postalCode = true
    setShippingErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleConfirmPurchase = async () => {
    if (!user) return
    setError(null)

    if (!validateShipping()) {
      setError('Completá los datos de envío antes de confirmar.')
      return
    }
    if (!acceptedTerms) {
      setError('Tenés que aceptar los términos y condiciones para continuar.')
      return
    }

    setLoading(true)

    try {
      const orderItems: OrderItem[] = items.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        imageUrl: item.product.imageUrl,
        category: item.product.category,
        unitPrice: item.product.price,
        quantity: item.quantity,
      }))

      await createOrder({
        userId: user.uid,
        items: orderItems,
        total,
        status: 'pending',
      })

      navigate(ROUTES.ORDERS, { state: { confirmed: true } })
      clearCart()
    } catch (err: any) {
      // Si la transacción rechazó la compra por falta de stock, mostramos
      // ese mensaje puntual en vez del genérico.
      if (err instanceof Error && err.message.includes('stock')) {
        setError(err.message)
      } else {
        setError('Ocurrió un error al confirmar la compra. Intentá de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (itemCount === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center text-gray-400 px-4">
        <p className="text-4xl mb-3">🛒</p>
        <p className="text-lg font-medium text-stone">Tu carrito está vacío</p>
        <button
          onClick={() => navigate(ROUTES.PRODUCTS)}
          className="mt-4 bg-stone text-white px-6 py-2 rounded-lg text-sm hover:bg-opacity-90 transition"
        >
          Ir al catálogo
        </button>
      </div>
    )
  }

  const inputClass = (hasError: boolean) =>
    `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none ${
      hasError ? 'border-red-400 focus:border-red-400' : 'border-gray-300 focus:border-glacier'
    }`

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone">Confirmar compra</h1>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-500 border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={15} />
          Atrás
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Datos de envío */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-stone mb-4 flex items-center gap-2">
          <MapPin size={17} className="text-glacier" />
          Datos de envío
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <label htmlFor="shipping-fullName" className="text-xs text-gray-500 mb-1 block">Nombre y apellido</label>
            <input
              id="shipping-fullName"
              type="text"
              value={shipping.fullName}
              onChange={e => handleShippingChange('fullName', e.target.value)}
              className={inputClass(!!shippingErrors.fullName)}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="shipping-address" className="text-xs text-gray-500 mb-1 block">Dirección</label>
            <input
              id="shipping-address"
              type="text"
              placeholder="Calle y número"
              value={shipping.address}
              onChange={e => handleShippingChange('address', e.target.value)}
              className={inputClass(!!shippingErrors.address)}
            />
          </div>
          <div>
            <label htmlFor="shipping-city" className="text-xs text-gray-500 mb-1 block">Ciudad</label>
            <input
              id="shipping-city"
              type="text"
              value={shipping.city}
              onChange={e => handleShippingChange('city', e.target.value)}
              className={inputClass(!!shippingErrors.city)}
            />
          </div>
          <div>
            <label htmlFor="shipping-postalCode" className="text-xs text-gray-500 mb-1 block">Código postal</label>
            <input
              id="shipping-postalCode"
              type="text"
              value={shipping.postalCode}
              onChange={e => handleShippingChange('postalCode', e.target.value)}
              className={inputClass(!!shippingErrors.postalCode)}
            />
          </div>
        </div>
      </div>

      {/* Resumen del pedido */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-stone mb-4">Resumen del pedido</h2>
        <div className="flex flex-col gap-3">
          {items.map(item => (
            <div key={item.product.id} className="flex justify-between text-sm">
              <span className="text-gray-600">{item.product.name} x{item.quantity}</span>
              <span className="font-medium text-stone">
                ${(item.product.price * item.quantity).toLocaleString('es-AR')}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 mt-4 pt-4 flex flex-col gap-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>${subtotal.toLocaleString('es-AR')}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Envío</span>
            <span className={freeShipping ? 'text-moss font-medium' : ''}>
              {freeShipping ? 'Gratis' : `$${shippingCost.toLocaleString('es-AR')}`}
            </span>
          </div>
        </div>
        <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between">
          <span className="font-semibold text-stone">Total</span>
          <span className="font-bold text-sunset text-lg">${total.toLocaleString('es-AR')}</span>
        </div>
      </div>

      {/* Método de pago */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-stone mb-4">Método de pago</h2>
        <div className="flex flex-col gap-2 mb-4">
          {PAYMENT_METHODS.map(method => (
            <label
              key={method.value}
              className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${
                paymentMethod === method.value ? 'border-sunset bg-sunset/5' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentMethod === method.value}
                onChange={() => setPaymentMethod(method.value)}
                className="accent-sunset"
              />
              <method.icon size={18} className="text-glacier shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-stone">{method.label}</p>
                <p className="text-xs text-gray-500">{method.description}</p>
              </div>
            </label>
          ))}
        </div>
        <p className="text-xs text-gray-400">
          Pago simulado — esta es una compra de demostración, no se procesa ningún cobro real.
        </p>
      </div>

      <label className="flex items-start gap-2 text-sm text-gray-600 mb-4 cursor-pointer">
        <input
          type="checkbox"
          checked={acceptedTerms}
          onChange={e => setAcceptedTerms(e.target.checked)}
          className="mt-0.5 accent-sunset"
        />
        Acepto los términos y condiciones y la política de cambios de Patagonix
      </label>

      <button
        onClick={handleConfirmPurchase}
        disabled={loading}
        className="w-full bg-stone text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition disabled:opacity-50"
      >
        {loading ? 'Procesando...' : 'Confirmar compra'}
      </button>
    </div>
  )
}