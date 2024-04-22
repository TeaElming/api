/* eslint-disable jsdoc/check-indentation */
/* eslint-disable jsdoc/check-tag-names */
import express from 'express'
import 'reflect-metadata'
import container from '../../../config/inversify.config.js'
import IDENTIFIERS from '../../../config/identifiers.js'
import { jwtVerification } from '../../../middleware/jwtVerification.js'
import { verifyOwnership } from '../../../middleware/ownershipMiddleware.js'
import { commentRouter } from './commentRouter.js'

export const recipeRouter = express.Router()

recipeRouter.post('/', jwtVerification, async (req, res) => {
  const recipeController = container.get(IDENTIFIERS.RecipeController)
  await recipeController.postRecipe(req, res)
})

recipeRouter.get('/', async (req, res) => {
  const recipeController = container.get(IDENTIFIERS.RecipeController)
  await recipeController.getAllRecipes(req, res)
})

recipeRouter.get('/:recipeId', async (req, res) => {
  const recipeController = container.get(IDENTIFIERS.RecipeController)
  await recipeController.getRecipeById(req, res)
})

recipeRouter.patch('/:recipeId', jwtVerification, verifyOwnership, async (req, res) => {
  const recipeController = container.get(IDENTIFIERS.RecipeController)
  await recipeController.patchRecipe(req, res)
})

recipeRouter.delete('/:recipeId', jwtVerification, verifyOwnership, async (req, res) => {
  const recipeController = container.get(IDENTIFIERS.RecipeController)
  await recipeController.deleteRecipe(req, res)
})

recipeRouter.use('/:recipeId/comments', commentRouter)
