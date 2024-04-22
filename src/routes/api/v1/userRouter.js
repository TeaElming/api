/* eslint-disable jsdoc/check-indentation */
/* eslint-disable jsdoc/check-tag-names */
import express from 'express'
import 'reflect-metadata'
import container from '../../../config/inversify.config.js'
import IDENTIFIERS from '../../../config/identifiers.js'
import { jwtVerification } from '../../../middleware/jwtVerification.js'
import { verifyUser } from '../../../middleware/userMiddleware.js'
import { favoritesRouter } from './favoritesRouter.js'

export const userRouter = express.Router()

userRouter.post('/register', async (req, res) => {
  const userController = container.get(IDENTIFIERS.UserController)
  await userController.postUser(req, res)
})

userRouter.patch('/:id', jwtVerification, verifyUser, async (req, res) => {
  const userController = container.get(IDENTIFIERS.UserController)
  await userController.patchUserById(req, res)
})

userRouter.delete('/:id', jwtVerification, verifyUser, async (req, res) => {
  const userController = container.get(IDENTIFIERS.UserController)
  await userController.deleteUserById(req, res)
})
userRouter.use('/:userId/favorites', favoritesRouter)
