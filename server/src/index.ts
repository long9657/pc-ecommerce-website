import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import userRouter from './routes/user.routes'
import mediasRouter from './routes/medias.routes'
import categoriesRouter from './routes/categories.routes'
import productsRouter from './routes/products.routes'
import purchasesRouter from './routes/purchases.routes'
import ordersRouter from './routes/orders.routes'
import database from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middleware'
import { initFolder, UPLOAD_DIR } from './utils/file'

const app = express()

initFolder()

app.use(cors())
app.use(express.json())

app.use('/users', userRouter)
app.use('/medias', mediasRouter)
app.use('/categories', categoriesRouter)
app.use('/products', productsRouter)
app.use('/purchases', purchasesRouter)
app.use('/orders', ordersRouter)
app.use('/uploads', express.static(UPLOAD_DIR))

app.use(defaultErrorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`dang nghe tren port ${PORT}`)
})

database.connect()
// console.log(database.user())
