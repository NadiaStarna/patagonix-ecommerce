import { useState, useEffect } from 'react'
import { getProducts, getProductsByCategory } from '../services/products.service'
import type { Product, ProductCategory } from '../types'

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'todas'>('todas')
  const [searchQuery, setSearchQuery] = useState('')

  // Cargar productos al montar el componente
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const data = await getProducts()
        console.log('Productos:', data)
        setProducts(data)
        setFilteredProducts(data)
      } catch (err) {
        setError('Error al cargar los productos')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Filtrar por categoría
  useEffect(() => {
    const filterProducts = async () => {
      try {
        setLoading(true)
        let data: Product[]

        if (selectedCategory === 'todas') {
          data = await getProducts()
        } else {
          data = await getProductsByCategory(selectedCategory)
        }

        setProducts(data)
        setFilteredProducts(data)
        setSearchQuery('')
      } catch (err) {
        setError('Error al filtrar los productos')
      } finally {
        setLoading(false)
      }
    }

    filterProducts()
  }, [selectedCategory])

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
    }, 400) // 400ms de debounce

    return () => clearTimeout(timer)
  }, [searchQuery, products])

  return {
    products: filteredProducts,
    loading,
    error,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
  }
}