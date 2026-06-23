export interface FavoritesDoc {
  productIds: string[]
}

export interface FavoritesContextType {
  favoriteIds: string[]
  isFavorite: (productId: string) => boolean
  toggleFavorite: (productId: string) => Promise<void>
  loading: boolean
}