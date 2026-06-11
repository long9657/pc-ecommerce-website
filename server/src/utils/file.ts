import { Request } from 'express'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export const UPLOAD_DIR = path.resolve('uploads')

export const initFolder = () => {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, {
      recursive: true
    })
  }
}

export const handleUploadImage = async (req: Request) => {
  const form = formidable({
    uploadDir: UPLOAD_DIR,
    maxFiles: 1,
    keepExtensions: true,
    maxFileSize: 2 * 1024 * 1024, // 2MB
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'image' && Boolean(mimetype?.includes('image/'))
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }
      return valid
    }
  })

  return new Promise<formidable.File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.image)) {
        return reject(new Error('File is empty'))
      }
      const fileArray = files.image as formidable.File[]
      fileArray.forEach((file) => {
        const ext = path.extname(file.originalFilename || '')
        const newFilename = `${uuidv4()}${ext}`
        fs.renameSync(file.filepath, path.resolve(UPLOAD_DIR, newFilename))
        file.newFilename = newFilename
      })
      resolve(fileArray)
    })
  })
}
