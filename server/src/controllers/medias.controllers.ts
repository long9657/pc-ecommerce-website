import { Request, Response } from 'express'
import { handleUploadImage } from '~/utils/file'

export const uploadImageController = async (req: Request, res: Response) => {
  const files = await handleUploadImage(req)
  const result = files.map((file) => {
    return {
      url: `http://localhost:${process.env.PORT || 4000}/uploads/${file.newFilename}`
    }
  })
  return res.json({
    message: 'Upload image successfully',
    result
  })
}
