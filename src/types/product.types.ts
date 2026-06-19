export type ProductCategory = 
  | 'trekking'
  | 'indumentaria'
  | 'tecnologia'
  | 'camping'
  | 'accesorios'

export interface Product {
  id: string
  name: string
  nameLower: string
  description: string
  price: number
  stock: number
  category: ProductCategory
  imageUrl: string
  createdAt: Date
  updatedAt: Date
}

export type CreateProductDTO = Omit<Product, 'id' | 'nameLower' | 'createdAt' | 'updatedAt'>
export type UpdateProductDTO = Partial<CreateProductDTO>