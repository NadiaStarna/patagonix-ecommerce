import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Solo permitimos POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  const { fileName, fileType } = req.body

  if (!fileName || !fileType) {
    return res.status(400).json({ error: 'fileName y fileType son requeridos' })
  }

  try {
    // Generamos un nombre único para el archivo
    const uniqueFileName = `products/${Date.now()}-${fileName}`

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: uniqueFileName,
      ContentType: fileType,
    })

    // Generamos la presigned URL con 5 minutos de expiración
    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 })

    // URL pública de la imagen una vez subida
    const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFileName}`

    return res.status(200).json({ presignedUrl, imageUrl })
  } catch (error) {
    console.error('Error generando presigned URL:', error)
    return res.status(500).json({ error: 'Error al generar la URL' })
  }
}