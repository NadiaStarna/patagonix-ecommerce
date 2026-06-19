// src/contexts/products/products.types.ts
import type { Product, ProductCategory } from '../../types'

export interface ProductsState {
  products: Product[]
  loading: boolean
  searching: boolean
  loadingMore: boolean
  hasMore: boolean
  error: string | null
  selectedCategory: ProductCategory | 'todas'
  searchQuery: string
}

export interface ProductsContextType extends ProductsState {
  setSelectedCategory: (category: ProductCategory | 'todas') => void
  setSearchQuery: (query: string) => void
  refetchProducts: () => Promise<void>
  loadMore: () => Promise<void>
}