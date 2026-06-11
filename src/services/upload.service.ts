// Solicita una presigned URL a la Vercel Serverless Function
// y sube el archivo directamente a S3
export const uploadImageToS3 = async (file: File): Promise<string> => {
  // Paso 1: Pedimos la presigned URL a nuestra Serverless Function
  const response = await fetch('/api/get-presigned-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type,
    }),
  })

  if (!response.ok) {
    throw new Error('Error al obtener la presigned URL')
  }

  const { presignedUrl, imageUrl } = await response.json()

  // Paso 2: Subimos el archivo directamente a S3 usando la presigned URL
  const uploadResponse = await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  })

  if (!uploadResponse.ok) {
    throw new Error('Error al subir la imagen a S3')
  }

  // Devolvemos la URL pública de la imagen
  return imageUrl
}