import type { Product, ProductCategory } from '../../types'

export interface ProductsState {
  products: Product[]               // todos los productos cargados desde Firestore
  filteredProducts: Product[]       // productos después de aplicar filtro + búsqueda
  loading: boolean
  error: string | null
  selectedCategory: ProductCategory | 'todas'
  searchQuery: string
}

export interface ProductsContextType extends ProductsState {
  setSelectedCategory: (category: ProductCategory | 'todas') => void
  setSearchQuery: (query: string) => void
  refetchProducts: () => Promise<void>
}