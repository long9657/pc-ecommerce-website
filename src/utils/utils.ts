import { AxiosError, HttpStatusCode, isAxiosError } from 'axios'
export function isAxiosErrorFunc<T>(error: unknown): error is AxiosError<T> {
  return isAxiosError(error)
}
export function isAxiosUnprocessableEntityError<FormError>(error: unknown): error is AxiosError<FormError> {
  return isAxiosErrorFunc(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}
