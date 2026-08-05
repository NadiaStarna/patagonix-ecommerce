import { useState, useEffect } from 'react'
import { Save, Store, Mail, Phone, Truck } from 'lucide-react'
import { getStoreSettings, updateStoreSettings, DEFAULT_SETTINGS, type StoreSettings } from '../../services/settings.service'

export const AdminSettingsPage = () => {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getStoreSettings()
        setSettings(data)
      } catch {
        setError('Error al cargar la configuración')
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const handleChange = (field: keyof StoreSettings, value: string) => {
    setSaved(false)
    if (field === 'freeShippingThreshold' || field === 'shippingCost') {
      setSettings(prev => ({ ...prev, [field]: Number(value) || 0 }))
    } else {
      setSettings(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      await updateStoreSettings(settings)
      setSaved(true)
    } catch (err: any) {
      if (err?.code === 'permission-denied') {
        setError('No tenés permisos para guardar la configuración.')
      } else {
        setError('Error al guardar. Intentá de nuevo.')
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-glacier border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-stone mb-1">Configuración</h1>
      <p className="text-sm text-gray-500 mb-5">Datos generales de la tienda, usados en el sitio público.</p>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-4">
        <div>
          <label className="text-sm text-gray-600 mb-1 flex items-center gap-1.5">
            <Store size={14} className="text-glacier" />
            Nombre de la tienda
          </label>
          <input
            type="text"
            value={settings.storeName}
            onChange={e => handleChange('storeName', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-glacier"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-1 flex items-center gap-1.5">
            <Mail size={14} className="text-glacier" />
            Email de contacto
          </label>
          <input
            type="email"
            value={settings.contactEmail}
            onChange={e => handleChange('contactEmail', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-glacier"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-1 flex items-center gap-1.5">
            <Phone size={14} className="text-glacier" />
            Teléfono de contacto
          </label>
          <input
            type="text"
            value={settings.contactPhone}
            onChange={e => handleChange('contactPhone', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-glacier"
          />
        </div>

        <hr className="border-gray-100" />

        <div>
          <label className="text-sm text-gray-600 mb-1 flex items-center gap-1.5">
            <Truck size={14} className="text-glacier" />
            Envío gratis a partir de ($)
          </label>
          <input
            type="number"
            min="0"
            value={settings.freeShippingThreshold}
            onChange={e => handleChange('freeShippingThreshold', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-glacier"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-1 flex items-center gap-1.5">
            <Truck size={14} className="text-glacier" />
            Costo de envío estándar ($)
          </label>
          <input
            type="number"
            min="0"
            value={settings.shippingCost}
            onChange={e => handleChange('shippingCost', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-glacier"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-stone text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition disabled:opacity-50"
          >
            <Save size={15} />
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
          {saved && <span className="text-sm text-moss">✓ Guardado</span>}
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-4">
        Estos valores ya se usan en el sitio real (navbar, hero, carrito, checkout, footer) — al guardar acá,
        se reflejan apenas se recargue la página.
      </p>
    </div>
  )
}