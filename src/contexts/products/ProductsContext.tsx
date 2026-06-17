import { createContext } from 'react'
import type { ProductsContextType } from './products.types'

export const ProductsContext = createContext<ProductsContextType | null>(null)