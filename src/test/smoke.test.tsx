import { describe, it, expect } from 'vitest'
import { render, screen } from './test-utils'
import './mocks/firebase'
import { ProductCard } from '../components/common/ProductCard'
import { mockProduct } from './fixtures'

describe('Smoke tests — la app renderiza sin explotar', () => {

  it('ProductCard renderiza sin errores', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('Mochila de trekking')).toBeInTheDocument()
  })

  it('ProductCard con sin stock renderiza sin errores', () => {
    render(<ProductCard product={{ ...mockProduct, stock: 0 }} />)
    expect(screen.getByText('Sin stock')).toBeInTheDocument()
  })

  it('ProductCard muestra el precio correctamente', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('$65.000')).toBeInTheDocument()
  })

  it('ProductCard muestra la categoría correctamente', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('trekking')).toBeInTheDocument()
  })

})