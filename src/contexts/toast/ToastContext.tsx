import { createContext } from 'react'

export interface ToastData {
  title: string
  description?: string
}

export interface ToastContextType {
  showToast: (toast: ToastData) => void
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined)