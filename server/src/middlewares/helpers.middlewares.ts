import { Request, Response, NextFunction } from 'express'
import { validationResult, check, body } from 'express-validator'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus, EntityError } from '~/models/Errors'
import { ObjectId } from 'mongodb'

const isMongoId = (id: string) => {
  return ObjectId.isValid(id)
}

const idRule = (...id: string[]) => {
  return id.map((item) => {
    return check(item).isMongoId().withMessage(`${item} không đúng định dạng MongoID`)
  })
}

const idValidator = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }

  return next(
    new ErrorWithStatus({
      message: 'ID không đúng định dạng',
      status: HTTP_STATUS.BAD_REQUEST
    })
  )
}

const helpersMiddleware = {
  idRule,
  idValidator
}

export default helpersMiddleware
