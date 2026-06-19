// src/contexts/products/ProductsProvider.tsx
import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { getProductsPage } from '../../services/products.service'
import { ProductsContext } from './ProductsContext'
import type { Product, ProductCategory } from '../../types'
import type { QueryDocumentSnapshot } from 'firebase/firestore'

export const ProductsProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'todas'>('todas')
  const [searchQuery, setSearchQuery] = useState('')

  const lastDocRef = useRef<QueryDocumentSnapshot<Product> | null>(null)

  const loadFirstPage = useCallback(async (category: ProductCategory | 'todas', search: string) => {
    try {
      setLoading(true)
      setError(null)
      lastDocRef.current = null

      const result = await getProductsPage({ category, searchPrefix: search })

      setProducts(result.products)
      setHasMore(result.hasMore)
      lastDocRef.current = result.lastDoc
    } catch (err) {
      setError('Error al cargar los productos')
    } finally {
      setLoading(false)
    }
  }, [])

  const loadMore = useCallback(async () => {
    if (!hasMore || loadingMore || !lastDocRef.current) return

    try {
      setLoadingMore(true)
      const result = await getProductsPage({
        category: selectedCategory,
        searchPrefix: searchQuery,
        cursor: lastDocRef.current,
      })

      setProducts(prev => {
        const existingIds = new Set(prev.map(p => p.id))
        const newOnes = result.products.filter(p => !existingIds.has(p.id))
        return [...prev, ...newOnes]
      })
      setHasMore(result.hasMore)
      lastDocRef.current = result.lastDoc
    } catch (err) {
      setError('Error al cargar más productos')
    } finally {
      setLoadingMore(false)
    }
  }, [hasMore, loadingMore, selectedCategory, searchQuery])

  const refetchProducts = useCallback(async () => {
    await loadFirstPage(selectedCategory, searchQuery)
  }, [loadFirstPage, selectedCategory, searchQuery])

  useEffect(() => {
    loadFirstPage(selectedCategory, '')
  }, [selectedCategory, loadFirstPage])

  useEffect(() => {
    const timer = setTimeout(() => {
      loadFirstPage(selectedCategory, searchQuery)
    }, 700)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const value = useMemo(
    () => ({
      products,
      loading,
      loadingMore,
      hasMore,
      error,
      selectedCategory,
      searchQuery,
      setSelectedCategory,
      setSearchQuery,
      refetchProducts,
      loadMore,
    }),
    [products, loading, loadingMore, hasMore, error, selectedCategory, searchQuery, refetchProducts, loadMore]
  )

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  )
}