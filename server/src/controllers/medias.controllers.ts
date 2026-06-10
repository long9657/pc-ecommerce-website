import { Request, Response } from 'express'
import { handleUploadImage } from '~/utils/file'

export const uploadImageController = async (req: Request, res: Response) => {
  const files = await handleUploadImage(req)
  const host = process.env.API_HOST || `http://localhost:${process.env.PORT || 3000}`
  const result = files.map((file) => {
    return {
      url: `${host}/uploads/${file.newFilename}`
    }
  })
  return res.json({
    message: 'Upload image successfully',
    result
  })
}
