/* eslint-disable jsdoc/check-indentation */
/* eslint-disable jsdoc/check-tag-names */
import express from 'express'
import 'reflect-metadata'
import container from '../../../config/inversify.config.js'
import IDENTIFIERS from '../../../config/identifiers.js'
import { jwtVerification } from '../../../middleware/jwtVerification.js'

export const webhookRouter = express.Router()

webhookRouter.post('/', jwtVerification, async (req, res) => {
  const webhookController = container.get(IDENTIFIERS.WebhookController)
  await webhookController.registerWebhook(req, res)
})

webhookRouter.delete('/:webhookId', jwtVerification, async (req, res) => {
  const webhookController = container.get(IDENTIFIERS.WebhookController)
  await webhookController.removeWebhook(req, res)
})
