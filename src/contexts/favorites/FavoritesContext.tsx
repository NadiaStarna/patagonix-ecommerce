import { createContext } from 'react'
import type { FavoritesContextType } from '../../types'

export const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)