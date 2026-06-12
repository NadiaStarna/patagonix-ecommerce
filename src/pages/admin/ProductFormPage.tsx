import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createProduct, updateProduct, getProductById } from '../../services/products.service'
import { uploadImageToS3 } from '../../services/upload.service'
import type { ProductCategory } from '../../types'
import { ROUTES } from '../../routes/routes'

const CATEGORIES: { label: string; value: ProductCategory }[] = [
  { label: 'Electrónica', value: 'electronica' },
  { label: 'Ropa', value: 'ropa' },
  { label: 'Hogar', value: 'hogar' },
  { label: 'Deportes', value: 'deportes' },
  { label: 'Otros', value: 'otros' },
]

export const ProductFormPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEditing = !!id

  const [loading, setLoading] = useState(false)
  const [loadingProduct, setLoadingProduct] = useState(isEditing)
  const [error, setError] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: 'electronica' as ProductCategory,
    imageUrl: '',
  })

  useEffect(() => {
    if (!isEditing) return
    const fetchProduct = async () => {
      try {
        const product = await getProductById(id)
        if (!product) return
        setForm({
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          stock: product.stock.toString(),
          category: product.category,
          imageUrl: product.imageUrl,
        })
        setImagePreview(product.imageUrl)
      } catch (err) {
        setError('Error al cargar el producto')
      } finally {
        setLoadingProduct(false)
      }
    }
    fetchProduct()
  }, [id, isEditing])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  // Validación del formulario antes de enviar
  const validateForm = (): string | null => {
    if (form.name.trim().length < 3) {
      return 'El nombre debe tener al menos 3 caracteres'
    }

    if (form.description.trim().length < 10) {
      return 'La descripción debe tener al menos 10 caracteres'
    }

    const price = Number(form.price)
    if (isNaN(price) || price <= 0) {
      return 'El precio debe ser un número mayor a 0'
    }

    const stock = Number(form.stock)
    if (isNaN(stock) || stock < 0) {
      return 'El stock debe ser un número mayor o igual a 0'
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validamos antes de procesar el formulario
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)

    try {
      let imageUrl = form.imageUrl

      if (imageFile) {
        try {
          imageUrl = await uploadImageToS3(imageFile)
        } catch (err) {
          imageUrl = `https://placehold.co/400x300?text=${encodeURIComponent(form.name)}`
        }
      }

      if (!imageUrl) {
        imageUrl = `https://placehold.co/400x300?text=${encodeURIComponent(form.name)}`
      }

      const productData = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        category: form.category,
        imageUrl,
      }

      if (isEditing) {
        await updateProduct(id, productData)
      } else {
        await createProduct(productData)
      }

      navigate(ROUTES.ADMIN_PRODUCTS)
    } catch (err) {
      setError('Error al guardar el producto')
    } finally {
      setLoading(false)
    }
  }

  if (loadingProduct) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-10 h-10 border-4 border-teal border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-navy mb-6">
        {isEditing ? 'Editar producto' : 'Nuevo producto'}
      </h1>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-4">

        {/* Nombre */}
        <div>
          <label className="text-sm text-gray-600 mb-1 block">Nombre</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-teal"
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="text-sm text-gray-600 mb-1 block">Descripción</label>
          <textarea
            value={form.description}
            onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
            required
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-teal resize-none"
          />
        </div>

        {/* Precio y Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Precio</label>
            <input
              type="number"
              value={form.price}
              onChange={e => setForm(prev => ({ ...prev, price: e.target.value }))}
              required
              min="0"
              step="0.01"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-teal"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Stock</label>
            <input
              type="number"
              value={form.stock}
              onChange={e => setForm(prev => ({ ...prev, stock: e.target.value }))}
              required
              min="0"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-teal"
            />
          </div>
        </div>

        {/* Categoría */}
        <div>
          <label className="text-sm text-gray-600 mb-1 block">Categoría</label>
          <select
            value={form.category}
            onChange={e => setForm(prev => ({ ...prev, category: e.target.value as ProductCategory }))}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-teal"
          >
            {CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        {/* Imagen */}
        <div>
          <label className="text-sm text-gray-600 mb-1 block">Imagen</label>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg mb-2"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-navy file:text-white file:text-sm hover:file:bg-opacity-90"
          />
          <p className="text-xs text-gray-400 mt-1">
            La imagen se sube a AWS S3
          </p>
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-navy text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear producto'}
          </button>
          <button
            type="button"
            onClick={() => navigate(ROUTES.ADMIN_PRODUCTS)}
            className="border border-gray-300 text-gray-600 px-6 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
        </div>

      </form>
    </div>
  )
}