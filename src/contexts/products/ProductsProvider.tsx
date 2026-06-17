import { useState, useEffect, useCallback, useMemo } from 'react'
import { getProducts, getProductsByCategory } from '../../services/products.service'
import { ProductsContext } from './ProductsContext'
import type { Product, ProductCategory } from '../../types'

export const ProductsProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'todas'>('todas')
  const [searchQuery, setSearchQuery] = useState('')

  // Función para recargar productos desde Firestore, memoizada con useCallback
  const refetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = selectedCategory === 'todas'
        ? await getProducts()
        : await getProductsByCategory(selectedCategory)
      setProducts(data)
      setFilteredProducts(data)
    } catch (err) {
      setError('Error al cargar los productos')
    } finally {
      setLoading(false)
    }
  }, [selectedCategory])

  // Cargar productos al montar y cuando cambia la categoría
  useEffect(() => {
    refetchProducts()
  }, [refetchProducts])

  // Búsqueda con debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim() === '') {
        setFilteredProducts(products)
      } else {
        const filtered = products.filter(p =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        setFilteredProducts(filtered)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [searchQuery, products])

  // Memoizamos el value para evitar re-renders innecesarios en cascada.
  // Solo cambia cuando alguna de estas dependencias realmente cambia.
  const value = useMemo(
    () => ({
      products,
      filteredProducts,
      loading,
      error,
      selectedCategory,
      searchQuery,
      setSelectedCategory,
      setSearchQuery,
      refetchProducts,
    }),
    [products, filteredProducts, loading, error, selectedCategory, searchQuery, refetchProducts]
  )

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  )
}