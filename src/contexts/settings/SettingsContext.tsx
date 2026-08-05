import { createContext } from 'react'
import type { StoreSettings } from '../../services/settings.service'

export interface SettingsContextType {
  settings: StoreSettings
  loading: boolean
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined)