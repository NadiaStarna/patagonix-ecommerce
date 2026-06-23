import { useState, useEffect, useCallback, useMemo } from 'react'
import { FavoritesContext } from './FavoritesContext'
import { getFavorites, setFavorites } from '../../services/favorites.service'
import { useAuth } from '../auth'

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth()
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setFavoriteIds([])
      setLoading(false)
      return
    }

    setLoading(true)
    getFavorites(user.uid)
      .then(setFavoriteIds)
      .finally(() => setLoading(false))
  }, [user])

  const isFavorite = useCallback(
    (productId: string) => favoriteIds.includes(productId),
    [favoriteIds]
  )

  const toggleFavorite = useCallback(async (productId: string) => {
    if (!user) return

    const next = favoriteIds.includes(productId)
      ? favoriteIds.filter(id => id !== productId)
      : [...favoriteIds, productId]

    setFavoriteIds(next)
    await setFavorites(user.uid, next)
  }, [favoriteIds, user])

  const value = useMemo(
    () => ({ favoriteIds, isFavorite, toggleFavorite, loading }),
    [favoriteIds, isFavorite, toggleFavorite, loading]
  )

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}