// Documento único por usuario en Firestore: favorites/{uid}
// Guardamos solo los IDs de producto, no el objeto completo, para no
// duplicar datos que ya viven en la colección products (igual lógica
// que el snapshot de OrderItem, pero al revés: aquí preferimos la
// referencia liviana porque los favoritos siempre reflejan el catálogo actual)
export interface FavoritesDoc {
  productIds: string[]
}

export interface FavoritesContextType {
  favoriteIds: string[]
  isFavorite: (productId: string) => boolean
  toggleFavorite: (productId: string) => Promise<void>
  loading: boolean
}