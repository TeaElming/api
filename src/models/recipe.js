/* eslint-disable jsdoc/check-indentation */
/* eslint-disable jsdoc/check-tag-names */
import mongoose from 'mongoose'

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  suggestedServings: Number,
  ingredients: [{
    name: String,
    amount: String
  }],
  instructions: [String],
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }]
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    /**
     * Remove the _id and __v fields from the JSON output and transform the _id field to id.
     *
     * @param {Document} doc - The mongoose document which is being converted
     * @param {Document} ret - The plain object representation which has been converted
     */
    transform: function (doc, ret) {
      delete ret._id // Remove '_id' field from the JSON output
      delete ret.__v // Remove '__v' field (version key) from the JSON output
    }
  }
})

export const Recipe = mongoose.model('Recipe', recipeSchema)
