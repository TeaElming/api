import express from 'express'
import { connectDB } from './config/mongoose.js'
import cors from 'cors'

import { config } from 'dotenv'
import { router as v1router } from './routes/api/v1/router.js'

config()

try {
  connectDB()
  console.log("I have connected to Mongo in the server.")

  const app = express()
  console.log("I have created an express app in the server.")

  app.use(cors())
  app.use(express.json())
  app.set('trust proxy', 1) // Trust first proxy


  app.use('/api/v1', v1router)

  // Catch-all for undefined routes
  app.use((req, res, next) => {
    res.status(404).json({ message: "Sorry can't find that!" })
  })

  // Global error handler
  app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ message: 'Something broke!' })
  })

  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
    console.log('Press Ctrl-C to terminate...')
  })
} catch (err) {
  console.error(err)
  process.exit(1)
}
