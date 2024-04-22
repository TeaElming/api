/* eslint-disable jsdoc/check-indentation */
/* eslint-disable jsdoc/check-tag-names */
import mongoose from 'mongoose'
const commentSchema = new mongoose.Schema({
  commentedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  comment: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export const Comment = mongoose.model('Comment', commentSchema)
