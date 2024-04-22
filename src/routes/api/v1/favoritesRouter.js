/* eslint-disable jsdoc/check-indentation */
/* eslint-disable jsdoc/check-tag-names */
import express from 'express'
import 'reflect-metadata'
import container from '../../../config/inversify.config.js'
import IDENTIFIERS from '../../../config/identifiers.js'
import { jwtVerification } from '../../../middleware/jwtVerification.js'

export const favoritesRouter = express.Router({ mergeParams: true })
favoritesRouter.get('/', jwtVerification, async (req, res) => {
  const favoritesController = container.get(IDENTIFIERS.FavoriteController)
  await favoritesController.getFavorites(req, res)
})

favoritesRouter.post('/:recipeId', jwtVerification, async (req, res) => {
  const favoritesController = container.get(IDENTIFIERS.FavoriteController)
  await favoritesController.postFavorite(req, res)
})

favoritesRouter.delete('/:recipeId', jwtVerification, async (req, res) => {
  const favoritesController = container.get(IDENTIFIERS.FavoriteController)
  await favoritesController.deleteFavorite(req, res)
})
