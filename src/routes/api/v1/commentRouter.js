/* eslint-disable jsdoc/check-indentation */
/* eslint-disable jsdoc/check-tag-names */
import express from 'express'
import 'reflect-metadata'
import container from '../../../config/inversify.config.js'
import IDENTIFIERS from '../../../config/identifiers.js'
import { jwtVerification } from '../../../middleware/jwtVerification.js'

// In commentRouter.js
export const commentRouter = express.Router({ mergeParams: true })

commentRouter.post('/', jwtVerification, async (req, res) => {
  const commentController = container.get(IDENTIFIERS.CommentController)
  await commentController.postComment(req, res)
})

commentRouter.get('/', async (req, res) => {
  const commentController = container.get(IDENTIFIERS.CommentController)
  await commentController.getComments(req, res)
})

commentRouter.get('/:commentId', async (req, res) => {
  const commentController = container.get(IDENTIFIERS.CommentController)
  await commentController.getCommentById(req, res)
})

commentRouter.put('/:commentId', jwtVerification, async (req, res) => {
  const commentController = container.get(IDENTIFIERS.CommentController)
  await commentController.putComment(req, res)
})

commentRouter.delete('/:commentId', jwtVerification, async (req, res) => {
  const commentController = container.get(IDENTIFIERS.CommentController)
  await commentController.deleteComment(req, res)
})
