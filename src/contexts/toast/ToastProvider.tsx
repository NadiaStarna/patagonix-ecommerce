import { useState, useCallback, useRef } from 'react'
import { ToastContext } from './ToastContext'
import type { ToastData } from './ToastContext'

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toast, setToast] = useState<ToastData | null>(null)
  const [visible, setVisible] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = useCallback((data: ToastData) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setToast(data)
    setVisible(true)
    timeoutRef.current = setTimeout(() => setVisible(false), 2500)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <div
          className="fixed top-4 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3 flex items-center gap-3 transition-transform duration-300"
          style={{ transform: visible ? 'translateX(0)' : 'translateX(120%)' }}
        >
          <span className="text-moss text-lg">✓</span>
          <div>
            <p className="text-sm font-medium text-stone">{toast.title}</p>
            {toast.description && (
              <p className="text-xs text-gray-500">{toast.description}</p>
            )}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  )
}