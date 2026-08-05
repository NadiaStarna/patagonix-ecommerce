import { Tent, Mountain, Shirt, Cpu, Backpack } from 'lucide-react'
import type { ProductCategory } from '../types'

export interface CategoryOption {
  label: string
  value: ProductCategory | 'todas'
  icon: typeof Tent
}

// Nota: el mockup original incluía "Calzado" como categoría, pero el modelo de
// datos de Patagonix (ProductCategory) solo contempla estas 5. Se deja afuera
// para no mostrar un filtro que no lleva a ningún producto real.
export const CATEGORIES: CategoryOption[] = [
  { label: 'Camping', value: 'camping', icon: Tent },
  { label: 'Trekking', value: 'trekking', icon: Mountain },
  { label: 'Indumentaria', value: 'indumentaria', icon: Shirt },
  { label: 'Tecnología', value: 'tecnologia', icon: Cpu },
  { label: 'Accesorios', value: 'accesorios', icon: Backpack },
]

export const CATEGORIES_WITH_ALL: { label: string; value: ProductCategory | 'todas' }[] = [
  { label: 'Todas', value: 'todas' },
  ...CATEGORIES.map(({ label, value }) => ({ label, value })),
]