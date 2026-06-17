import '@testing-library/jest-dom'
import { beforeEach } from 'vitest'

// Mock simple de localStorage para el entorno de tests (jsdom no lo
// implementa de forma persistente entre tests por defecto en todos los casos,
// así que lo controlamos explícitamente)
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Antes de cada test, limpiamos localStorage para que ningún test
// herede estado guardado por un test anterior (como el carrito persistido)
beforeEach(() => {
  window.localStorage.clear()
})