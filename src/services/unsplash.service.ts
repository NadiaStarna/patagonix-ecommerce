export interface UnsplashPhoto {
  id: string
  url: string           // URL de la imagen, tamaño "regular"
  thumbUrl: string       // URL chica, para mostrar en la grilla de resultados
  photographerName: string
  photographerProfileUrl: string
  downloadLocation: string   // endpoint que hay que "avisar" cuando se usa la foto (requisito de Unsplash)
}

const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY as string | undefined

export const searchUnsplashPhotos = async (query: string): Promise<UnsplashPhoto[]> => {
  if (!ACCESS_KEY) {
    throw new Error('Falta configurar VITE_UNSPLASH_ACCESS_KEY en el archivo .env')
  }
  if (!query.trim()) return []

  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=9&orientation=squarish`,
    { headers: { Authorization: `Client-ID ${ACCESS_KEY}` } }
  )

  if (!res.ok) {
    throw new Error(`Error al buscar en Unsplash (${res.status})`)
  }

  const data = await res.json()

  return (data.results ?? []).map((photo: any) => ({
    id: photo.id,
    url: photo.urls.regular,
    thumbUrl: photo.urls.thumb,
    photographerName: photo.user?.name ?? 'Desconocido',
    photographerProfileUrl: photo.user?.links?.html ?? 'https://unsplash.com',
    downloadLocation: photo.links?.download_location ?? '',
  }))
}

// Unsplash pide "avisarles" cuando una foto de búsqueda efectivamente se usa
// (no solo se muestra en resultados) — este endpoint hace ese aviso.
export const triggerUnsplashDownload = async (downloadLocation: string): Promise<void> => {
  if (!ACCESS_KEY || !downloadLocation) return
  try {
    await fetch(downloadLocation, {
      headers: { Authorization: `Client-ID ${ACCESS_KEY}` },
    })
  } catch {
    // No es crítico si esto falla — no bloqueamos el flujo del admin por esto
  }
}