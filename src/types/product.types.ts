// Categorías posibles de un producto
export type ProductCategory = 
  | 'electronica'
  | 'ropa'
  | 'hogar'
  | 'deportes'
  | 'otros'

// Interface principal de un producto
export interface Product {
  id: string                  // ID único generado por Firestore
  name: string                // Nombre del producto
  nameLower: string            // Nombre en minúsculas, para búsqueda por prefijo en Firestore
  description: string         // Descripción detallada
  price: number               // Precio en pesos
  stock: number               // Cantidad disponible
  category: ProductCategory   // Categoría del producto
  imageUrl: string            // URL de la imagen en AWS S3
  createdAt: Date             // Fecha de creación
  updatedAt: Date             // Fecha de última modificación
}

// Lo que se necesita para crear un producto nuevo (sin id, nameLower ni fechas, los genera el sistema)
export type CreateProductDTO = Omit<Product, 'id' | 'nameLower' | 'createdAt' | 'updatedAt'>

// Lo que se puede modificar de un producto (todos los campos son opcionales)
export type UpdateProductDTO = Partial<CreateProductDTO>