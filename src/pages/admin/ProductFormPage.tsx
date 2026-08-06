import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createProduct, updateProduct, getProductById } from '../../services/products.service'
import { uploadImageToS3 } from '../../services/upload.service'
import { searchUnsplashPhotos, triggerUnsplashDownload, type UnsplashPhoto } from '../../services/unsplash.service'
import { useAuth } from '../../contexts/auth'
import { ArrowLeft, X, Plus, Search, Check } from 'lucide-react'
import type { ProductCategory } from '../../types'
import { ROUTES } from '../../routes/routes'

const CATEGORIES: { label: string; value: ProductCategory }[] = [
  { label: 'Trekking', value: 'trekking' },
  { label: 'Indumentaria', value: 'indumentaria' },
  { label: 'Tecnología', value: 'tecnologia' },
  { label: 'Camping', value: 'camping' },
  { label: 'Accesorios', value: 'accesorios' },
]

interface FormErrors {
  name?: string
  description?: string
  price?: string
  stock?: string
}

interface GalleryImage {
  id: string
  file: File | null   // null = ya está subida (viene de Firestore), no hay que volver a subirla
  preview: string
  uploadedUrl: string | null
}

export const ProductFormPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const isEditing = !!id
  const isDemo = user?.role === 'demo'

  const [status, setStatus] = useState<'editing' | 'submitting' | 'success' | 'error'>('editing')
  const [loadingProduct, setLoadingProduct] = useState(isEditing)
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [gallery, setGallery] = useState<GalleryImage[]>([])
  const [colorInput, setColorInput] = useState('')
  const [unsplashQuery, setUnsplashQuery] = useState('')
  const [unsplashResults, setUnsplashResults] = useState<UnsplashPhoto[]>([])
  const [unsplashLoading, setUnsplashLoading] = useState(false)
  const [unsplashError, setUnsplashError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: 'trekking' as ProductCategory,
    imageUrl: '',
    featured: false,
    colors: [] as string[],
    imageCredit: '',
    imageCreditUrl: '',
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
          featured: product.featured,
          colors: product.colors ?? [],
          imageCredit: product.imageCredit ?? '',
          imageCreditUrl: product.imageCreditUrl ?? '',
        })
        setImagePreview(product.imageUrl)
        setGallery(
          (product.images ?? []).map(url => ({
            id: url,
            file: null,
            preview: url,
            uploadedUrl: url,
          }))
        )
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
    // Si subís una foto propia, dejamos de usar el crédito de Unsplash (ya no aplica)
    setForm(prev => ({ ...prev, imageCredit: '', imageCreditUrl: '' }))
  }

  const handleUnsplashSearch = async () => {
    if (!unsplashQuery.trim()) return
    setUnsplashLoading(true)
    setUnsplashError(null)
    try {
      const results = await searchUnsplashPhotos(unsplashQuery)
      setUnsplashResults(results)
      if (results.length === 0) {
        setUnsplashError('No se encontraron fotos para esa búsqueda.')
      }
    } catch (err: any) {
      setUnsplashError(err?.message ?? 'Error al buscar en Unsplash')
    } finally {
      setUnsplashLoading(false)
    }
  }

  const handleSelectUnsplashPhoto = async (photo: UnsplashPhoto) => {
    setImageFile(null)
    setImagePreview(photo.url)
    setForm(prev => ({
      ...prev,
      imageUrl: photo.url,
      imageCredit: photo.photographerName,
      imageCreditUrl: photo.photographerProfileUrl,
    }))
    // Requisito de Unsplash: avisarles cuando una foto de búsqueda se usa de verdad
    triggerUnsplashDownload(photo.downloadLocation)
  }

  const handleAddUnsplashToGallery = (photo: UnsplashPhoto) => {
    setGallery(prev => [
      ...prev,
      { id: photo.id, file: null, preview: photo.url, uploadedUrl: photo.url },
    ])
    triggerUnsplashDownload(photo.downloadLocation)
  }

  const handleGalleryAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return
    const newImages: GalleryImage[] = files.map(file => ({
      id: `${file.name}-${file.lastModified}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
      uploadedUrl: null,
    }))
    setGallery(prev => [...prev, ...newImages])
    e.target.value = ''
  }

  const handleGalleryRemove = (imageId: string) => {
    setGallery(prev => prev.filter(img => img.id !== imageId))
  }

  const handleAddColor = () => {
    const color = colorInput.trim()
    if (!color) return
    if (form.colors.some(c => c.toLowerCase() === color.toLowerCase())) {
      setColorInput('')
      return
    }
    setForm(prev => ({ ...prev, colors: [...prev.colors, color] }))
    setColorInput('')
  }

  const handleColorKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      handleAddColor()
    }
  }

  const handleRemoveColor = (color: string) => {
    setForm(prev => ({ ...prev, colors: prev.colors.filter(c => c !== color) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGlobalError(null)

    if (isDemo) {
      setGlobalError('Estás en modo demo (solo lectura) — no se pueden guardar cambios con esta cuenta.')
      return
    }

    setTouched({ name: true, description: true, price: true, stock: true })

    const errors = validateAll()
    setFieldErrors(errors)

    const hasErrors = Object.values(errors).some(Boolean)
    if (hasErrors) return

    setStatus('submitting')

    try {
      let imageUrl = form.imageUrl
      let anyUploadFailed = false

      if (imageFile) {
        try {
          imageUrl = await uploadImageToS3(imageFile)
        } catch (err) {
          anyUploadFailed = true
          imageUrl = imageUrl || `https://placehold.co/400x300?text=${encodeURIComponent(form.name)}`
        }
      }

      if (!imageUrl) {
        imageUrl = `https://placehold.co/400x300?text=${encodeURIComponent(form.name)}`
      }

      // Subimos las imágenes de galería que todavía no tengan URL (las nuevas);
      // las que ya venían de Firestore (uploadedUrl seteado) no se vuelven a subir.
      const galleryUrls: string[] = []
      for (const img of gallery) {
        if (img.uploadedUrl) {
          galleryUrls.push(img.uploadedUrl)
          continue
        }
        if (img.file) {
          try {
            const url = await uploadImageToS3(img.file)
            galleryUrls.push(url)
          } catch {
            anyUploadFailed = true
          }
        }
      }

      const productData = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        category: form.category,
        imageUrl,
        images: galleryUrls,
        colors: form.colors,
        imageCredit: form.imageCredit,
        imageCreditUrl: form.imageCreditUrl,
        featured: form.featured,
      }

      if (isEditing) {
        await updateProduct(id, productData)
      } else {
        await createProduct(productData)
      }

      if (anyUploadFailed) {
        alert(
          'El producto se guardó, pero alguna foto NO se pudo subir a S3 (la función de subida solo funciona con el sitio deployado en Vercel, no con "npm run dev" local). Probá subir las fotos una vez que el sitio esté deployado.'
        )
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone">
          {isEditing ? 'Editar producto' : 'Nuevo producto'}
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-500 border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={15} />
          Atrás
        </button>
      </div>

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
          <label className="text-sm text-gray-600 mb-1 block">Colores disponibles</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={colorInput}
              onChange={e => setColorInput(e.target.value)}
              onKeyDown={handleColorKeyDown}
              disabled={isSubmitting}
              placeholder="Ej: Verde militar — Enter para agregar"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-glacier disabled:bg-gray-100"
            />
            <button
              type="button"
              onClick={handleAddColor}
              disabled={isSubmitting || !colorInput.trim()}
              className="border border-gray-300 text-stone px-3 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              <Plus size={16} />
            </button>
          </div>
          {form.colors.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {form.colors.map(color => (
                <span
                  key={color}
                  className="flex items-center gap-1.5 bg-fog text-stone text-xs px-2.5 py-1 rounded-full"
                >
                  {color}
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(color)}
                    disabled={isSubmitting}
                    aria-label={`Quitar ${color}`}
                  >
                    <X size={12} className="text-gray-400 hover:text-red-500" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <p className="text-xs text-gray-400 mt-1">
            Opcional. Son solo etiquetas de texto — no manejan stock ni precio por separado.
          </p>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={e => setForm(prev => ({ ...prev, featured: e.target.checked }))}
              disabled={isSubmitting}
              className="w-4 h-4 accent-sunset"
            />
            Mostrar en "Productos destacados" del home
          </label>
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-1 block">Buscar foto en Unsplash</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={unsplashQuery}
              onChange={e => setUnsplashQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleUnsplashSearch()
                }
              }}
              disabled={isSubmitting}
              placeholder="Ej: mochila trekking montaña"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-glacier disabled:bg-gray-100"
            />
            <button
              type="button"
              onClick={handleUnsplashSearch}
              disabled={isSubmitting || unsplashLoading || !unsplashQuery.trim()}
              className="flex items-center gap-1.5 bg-stone text-white px-4 rounded-lg text-sm hover:bg-opacity-90 transition disabled:opacity-50"
            >
              <Search size={14} />
              {unsplashLoading ? 'Buscando…' : 'Buscar'}
            </button>
          </div>

          {unsplashError && (
            <p className="text-red-500 text-xs mt-2">{unsplashError}</p>
          )}

          {unsplashResults.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              {unsplashResults.map(photo => {
                const isSelected = form.imageUrl === photo.url
                return (
                  <div key={photo.id} className="relative group">
                    <img
                      src={photo.thumbUrl}
                      alt={`Foto de ${photo.photographerName} en Unsplash`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 rounded-lg transition-colors flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => handleSelectUnsplashPhoto(photo)}
                        title="Usar como imagen principal"
                        className="bg-white text-stone text-xs px-2 py-1 rounded-md font-medium hover:bg-fog transition"
                      >
                        Principal
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddUnsplashToGallery(photo)}
                        title="Agregar a la galería"
                        className="bg-white text-stone text-xs px-2 py-1 rounded-md font-medium hover:bg-fog transition"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    {isSelected && (
                      <span className="absolute top-1 right-1 bg-sunset text-white rounded-full w-5 h-5 flex items-center justify-center">
                        <Check size={12} />
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          )}
          <p className="text-xs text-gray-400 mt-2">
            Fotos reales de Unsplash (no generadas por IA) — al elegir una queda guardado el crédito del fotógrafo, que se muestra en la pantalla de detalle del producto.
          </p>
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-1 block">Imagen principal</label>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg mb-2"
            />
          )}
          {form.imageCredit && (
            <p className="text-xs text-gray-400 mb-2">
              Crédito actual: foto de {form.imageCredit} en Unsplash
            </p>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={isSubmitting}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-stone file:text-white file:text-sm hover:file:bg-opacity-90 disabled:opacity-50"
          />
          <p className="text-xs text-gray-400 mt-1">
            Es la foto que se ve en el catálogo y las cards. Si editás y no elegís una nueva, se mantiene la actual.
          </p>
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-1 block">Fotos adicionales (galería)</label>
          {gallery.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {gallery.map(img => (
                <div key={img.id} className="relative">
                  <img
                    src={img.preview}
                    alt="Foto de galería"
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleGalleryRemove(img.id)}
                    disabled={isSubmitting}
                    aria-label="Quitar foto"
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-stone text-white rounded-full flex items-center justify-center hover:bg-red-500 transition"
                  >
                    <X size={11} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleGalleryAdd}
            disabled={isSubmitting}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-stone file:text-white file:text-sm hover:file:bg-opacity-90 disabled:opacity-50"
          />
          <p className="text-xs text-gray-400 mt-1">
            Opcional. Se muestran en la galería de la pantalla de detalle, además de la imagen principal.
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting || isDemo}
            className="bg-stone text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition disabled:opacity-50"
          >
            {isDemo ? 'Solo lectura' : isSubmitting ? 'Guardando…' : isEditing ? 'Guardar cambios' : 'Crear producto'}
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