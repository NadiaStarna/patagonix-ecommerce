import { useState, useEffect } from 'react'
import { SettingsContext } from './SettingsContext'
import { getStoreSettings, DEFAULT_SETTINGS } from '../../services/settings.service'
import type { StoreSettings } from '../../services/settings.service'

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getStoreSettings()
        setSettings(data)
      } catch {
        // Si falla, seguimos con los valores por defecto — no queremos
        // romper el sitio entero por esto.
        setSettings(DEFAULT_SETTINGS)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  )
}