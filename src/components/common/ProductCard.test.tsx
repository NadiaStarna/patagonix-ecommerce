import { describe, it, expect } from 'vitest'
import { render, screen } from '../../test/test-utils'
import '../../test/mocks/firebase'
import { ProductCard } from './ProductCard'
import type { Product } from '../../types'

const mockProduct: Product = {
  id: '1',
  name: 'Laptop Gaming',
  nameLower: 'laptop gaming',
  description: 'Laptop de alta performance',
  price: 150000,
  stock: 10,
  category: 'tecnologia',
  imageUrl: 'https://placehold.co/400',
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('ProductCard', () => {

  it('debe mostrar el nombre del producto', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('Laptop Gaming')).toBeInTheDocument()
  })

  it('debe mostrar el precio formateado', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('$150.000')).toBeInTheDocument()
  })

  it('debe mostrar la categoría del producto', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('electronica')).toBeInTheDocument()
  })

  it('debe mostrar el stock disponible', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('10 disponibles')).toBeInTheDocument()
  })

  it('debe mostrar "Sin stock" cuando el stock es 0', () => {
    const productSinStock = { ...mockProduct, stock: 0 }
    render(<ProductCard product={productSinStock} />)
    expect(screen.getByText('Sin stock')).toBeInTheDocument()
  })

  it('debe tener un link al detalle del producto', () => {
    render(<ProductCard product={mockProduct} />)
    const link = screen.getByText('Ver detalle').closest('a')
    expect(link).toHaveAttribute('href', '/products/1')
  })

})