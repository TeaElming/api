/* eslint-disable jsdoc/check-indentation */
/* eslint-disable jsdoc/check-tag-names */
import express from 'express'
import 'reflect-metadata'
import container from '../../../config/inversify.config.js'
import IDENTIFIERS from '../../../config/identifiers.js'

export const searchRouter = express.Router()

searchRouter.get('/', async (req, res) => {
  const searchController = container.get(IDENTIFIERS.SearchController)
  await searchController.getRecipes(req, res)
})
