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
  images: string[]
  colors: string[]
  // Si la imagen principal viene de Unsplash, guardamos el crédito del
  // fotógrafo acá — Unsplash exige mostrarlo donde se use la foto.
  imageCredit?: string
  imageCreditUrl?: string
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

export type CreateProductDTO = Omit<Product, 'id' | 'nameLower' | 'createdAt' | 'updatedAt'>
export type UpdateProductDTO = Partial<CreateProductDTO>