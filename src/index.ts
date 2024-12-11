import bodyParser from 'body-parser'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import * as dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import http from 'node:http'
import router from './router'

dotenv.config()
const port = process.env.PORT
const app = express()
app.use(
  cors({
    credentials: true,
  })
)
app.use(compression())
app.use(cookieParser())
app.use(bodyParser.json())
const server = http.createServer(app)
server.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`)
})

const username = process.env.MONGO_USERNAME
const password = process.env.MONGO_PASSWORD
const MONGO_URI = `mongodb+srv://${username}:${password}@cluster0.nshikgn.mongodb.net/?retryWrites=true&w=majority`

mongoose.Promise = Promise
mongoose.connect(MONGO_URI)
mongoose.connection.on('error', (error: Error) => {
  return console.log('🚀 ~ error:', error)
  // return console.log(console.error())
})
app.use('/', router())
