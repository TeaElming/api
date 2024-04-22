/* eslint-disable jsdoc/check-indentation */
/* eslint-disable jsdoc/check-tag-names */
import mongoose from 'mongoose'

const webhookSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  eventType: {
    type: String,
    required: true,
    enum: ['recipe_added', 'recipe_updated', 'comment_added', 'comment-updated', 'webhook_added', 'webhook_removed']
  },
  secret: {
    type: String,
    required: false // Think about this one!!
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

export const Webhook = mongoose.model('Webhook', webhookSchema)
