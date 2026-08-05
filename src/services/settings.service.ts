import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from './firebase'

export interface StoreSettings {
  storeName: string
  contactEmail: string
  contactPhone: string
  freeShippingThreshold: number
  shippingCost: number
}

const settingsRef = doc(db, 'settings', 'store')

export const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'Patagonix',
  contactEmail: 'contacto@patagonix.com.ar',
  contactPhone: '+54 9 11 5555-0199',
  freeShippingThreshold: 99000,
  shippingCost: 6000,
}

export const getStoreSettings = async (): Promise<StoreSettings> => {
  const snapshot = await getDoc(settingsRef)
  if (!snapshot.exists()) return DEFAULT_SETTINGS
  const data = snapshot.data()
  return {
    storeName: data.storeName ?? DEFAULT_SETTINGS.storeName,
    contactEmail: data.contactEmail ?? DEFAULT_SETTINGS.contactEmail,
    contactPhone: data.contactPhone ?? DEFAULT_SETTINGS.contactPhone,
    freeShippingThreshold: data.freeShippingThreshold ?? DEFAULT_SETTINGS.freeShippingThreshold,
    shippingCost: data.shippingCost ?? DEFAULT_SETTINGS.shippingCost,
  }
}

export const updateStoreSettings = async (settings: StoreSettings): Promise<void> => {
  await setDoc(settingsRef, settings)
}