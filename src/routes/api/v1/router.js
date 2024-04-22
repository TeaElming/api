/* eslint-disable jsdoc/check-indentation */
/* eslint-disable jsdoc/check-tag-names */
import express from 'express'
import 'reflect-metadata'
import { authRouter } from './authRouter.js'
import { recipeRouter } from './recipeRouter.js'
import { searchRouter } from './searchRouter.js'
import { userRouter } from './userRouter.js'
import { webhookRouter } from './webhookRouter.js'

export const router = express.Router()

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to your API!' })
})

router.use('/auth', authRouter)

// Recipe routes
router.use('/recipes', recipeRouter)

// Search routes
router.use('/search', searchRouter)

// User routes
router.use('/users', userRouter)

// Webhook routes
router.use('/webhooks', webhookRouter)
