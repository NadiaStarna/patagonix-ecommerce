import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { randomUUID } from 'node:crypto'

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

// Solo permitimos subir imágenes, no cualquier tipo de archivo
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  const { fileName, fileType } = req.body

  if (!fileName || !fileType) {
    return res.status(400).json({ error: 'fileName y fileType son requeridos' })
  }

  // Validamos que el tipo de archivo sea una imagen permitida
  if (!ALLOWED_TYPES.includes(fileType)) {
    return res.status(400).json({ error: 'Tipo de archivo no permitido. Solo se aceptan JPEG, PNG o WEBP.' })
  }

  try {
    // Usamos randomUUID en lugar de Date.now() para evitar colisiones
    // si dos admins suben un archivo en el mismo milisegundo
    const uniqueFileName = `products/${randomUUID()}-${fileName}`

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: uniqueFileName,
      ContentType: fileType,
    })

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 })

    const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFileName}`

    return res.status(200).json({ presignedUrl, imageUrl })
  } catch (error) {
    console.error('Error generando presigned URL:', error)
    return res.status(500).json({ error: 'Error al generar la URL' })
  }
}