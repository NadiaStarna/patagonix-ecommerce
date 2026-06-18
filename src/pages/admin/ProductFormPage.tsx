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

interface FormErrors {
  name?: string
  description?: string
  price?: string
  stock?: string
}

export const ProductFormPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEditing = !!id

  const [status, setStatus] = useState<'editing' | 'submitting' | 'success' | 'error'>('editing')
  const [loadingProduct, setLoadingProduct] = useState(isEditing)
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
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
        setGlobalError('Error al cargar el producto')
      } finally {
        setLoadingProduct(false)
      }
    }
    fetchProduct()
  }, [id, isEditing])

  const validateField = (field: keyof FormErrors, value: string): string | undefined => {
    switch (field) {
      case 'name':
        return value.trim().length < 3 ? 'El nombre debe tener al menos 3 caracteres' : undefined
      case 'description':
        return value.trim().length < 10 ? 'La descripción debe tener al menos 10 caracteres' : undefined
      case 'price': {
        const price = Number(value)
        return isNaN(price) || price <= 0 ? 'El precio debe ser mayor a 0' : undefined
      }
      case 'stock': {
        const stock = Number(value)
        return isNaN(stock) || stock < 0 ? 'El stock no puede ser negativo' : undefined
      }
      default:
        return undefined
    }
  }

  const validateAll = (): FormErrors => {
    return {
      name: validateField('name', form.name),
      description: validateField('description', form.description),
      price: validateField('price', form.price),
      stock: validateField('stock', form.stock),
    }
  }

  const handleBlur = (field: keyof FormErrors) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    const error = validateField(field, form[field])
    setFieldErrors(prev => ({ ...prev, [field]: error }))
  }

  const handleFieldChange = (field: keyof FormErrors, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (touched[field]) {
      const error = validateField(field, value)
      setFieldErrors(prev => ({ ...prev, [field]: error }))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGlobalError(null)

    setTouched({ name: true, description: true, price: true, stock: true })

    const errors = validateAll()
    setFieldErrors(errors)

    const hasErrors = Object.values(errors).some(Boolean)
    if (hasErrors) return

    setStatus('submitting')

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

      setStatus('success')
      navigate(ROUTES.ADMIN_PRODUCTS)
    } catch (err: any) {
      setStatus('error')
      if (err?.code === 'permission-denied') {
        setGlobalError('No tenés permisos para esta acción. Si creés que es un error, reintentá loguearte o consultá al administrador.')
      } else {
        setGlobalError('Ocurrió un error al guardar el producto. Intentá de nuevo.')
      }
    }
  }

  if (loadingProduct) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-glacier border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const isSubmitting = status === 'submitting'

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-stone mb-6">
        {isEditing ? 'Editar producto' : 'Nuevo producto'}
      </h1>

      {globalError && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
          {globalError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-4">

        <div>
          <label className="text-sm text-gray-600 mb-1 block">Nombre</label>
          <input
            type="text"
            value={form.name}
            onChange={e => handleFieldChange('name', e.target.value)}
            onBlur={() => handleBlur('name')}
            disabled={isSubmitting}
            className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none disabled:bg-gray-100 ${
              fieldErrors.name ? 'border-red-400 focus:border-red-400' : 'border-gray-300 focus:border-glacier'
            }`}
          />
          {fieldErrors.name && (
            <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>
          )}
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-1 block">Descripción</label>
          <textarea
            value={form.description}
            onChange={e => handleFieldChange('description', e.target.value)}
            onBlur={() => handleBlur('description')}
            disabled={isSubmitting}
            rows={3}
            className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none resize-none disabled:bg-gray-100 ${
              fieldErrors.description ? 'border-red-400 focus:border-red-400' : 'border-gray-300 focus:border-glacier'
            }`}
          />
          {fieldErrors.description && (
            <p className="text-red-500 text-xs mt-1">{fieldErrors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Precio</label>
            <input
              type="number"
              value={form.price}
              onChange={e => handleFieldChange('price', e.target.value)}
              onBlur={() => handleBlur('price')}
              disabled={isSubmitting}
              min="0"
              step="0.01"
              className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none disabled:bg-gray-100 ${
                fieldErrors.price ? 'border-red-400 focus:border-red-400' : 'border-gray-300 focus:border-glacier'
              }`}
            />
            {fieldErrors.price && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.price}</p>
            )}
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Stock</label>
            <input
              type="number"
              value={form.stock}
              onChange={e => handleFieldChange('stock', e.target.value)}
              onBlur={() => handleBlur('stock')}
              disabled={isSubmitting}
              min="0"
              className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none disabled:bg-gray-100 ${
                fieldErrors.stock ? 'border-red-400 focus:border-red-400' : 'border-gray-300 focus:border-glacier'
              }`}
            />
            {fieldErrors.stock && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.stock}</p>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-1 block">Categoría</label>
          <select
            value={form.category}
            onChange={e => setForm(prev => ({ ...prev, category: e.target.value as ProductCategory }))}
            disabled={isSubmitting}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-glacier disabled:bg-gray-100"
          >
            {CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

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
            disabled={isSubmitting}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-stone file:text-white file:text-sm hover:file:bg-opacity-90 disabled:opacity-50"
          />
          <p className="text-xs text-gray-400 mt-1">
            La imagen se sube a AWS S3. Si editás y no elegís una nueva, se mantiene la actual.
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-stone text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition disabled:opacity-50"
          >
            {isSubmitting ? 'Guardando…' : isEditing ? 'Guardar cambios' : 'Crear producto'}
          </button>
          <button
            type="button"
            onClick={() => navigate(ROUTES.ADMIN_PRODUCTS)}
            disabled={isSubmitting}
            className="border border-gray-300 text-gray-600 px-6 py-2 rounded-lg text-sm hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>

      </form>
    </div>
  )
}