import { Recipe } from '../models/recipe.js'
import { Comment } from '../models/comment.js'

/**
 * Service class for comments.
 */
export class CommentService {
  /**
   * Constructor for the CommentService class.
   *
   * @param {object} webhookService - The webhook service injected by the dependency injection.
   */
  constructor (webhookService) {
    this.webhookService = webhookService
  }

  /**
   * Create a new comment.
   *
   * @param {string} userId - The user id.
   * @param {string} recipeId - The recipe id.
   * @param {string} commentText - The comment data.
   * @returns { Promise<Document>} - The created comment.
   */
  async createComment (userId, recipeId, commentText) {
    try {
      const recipe = await Recipe.findById(recipeId)
      if (!recipe) {
        throw new Error('Recipe not found')
      }
      const comment = new Comment({ commentedBy: userId, comment: commentText })
      comment.save()
      recipe.comments.push(comment)

      // Trigger the webhook
      this.webhookService.triggerWebhook('comment_added', recipe)
      await recipe.save()
      return recipe.comments[recipe.comments.length - 1] // Return the newly added comment, last in the array
    } catch (error) {
      throw new Error(`Error creating comment: ${error.message}`)
    }
  }

  /**
   * Read all comments.
   *
   * @param {string} recipeId - The recipe id.
   * @returns {Promise<Document[]>} - All comments.
   */
  async readComments (recipeId) {
    try {
      const recipe = await Recipe.findById(recipeId).populate('comments')
      if (!recipe) {
        throw new Error('Recipe not found')
      }

      return recipe.comments
    } catch (error) {
      throw new Error(`Error reading comments: ${error.message}`)
    }
  }

  /**
   * Read specific comment.
   *
   * @param {string} recipeId - The recipe id.
   * @param {string} commentId - The comment id.
   * @returns {Promise<Document>} - The comment.
   * @memberof CommentService
   */
  async readCommentById (recipeId, commentId) {
    try {
      const recipe = await Recipe.findById(recipeId).populate('comments.commentedBy')
      if (!recipe) {
        throw new Error('Recipe not found')
      }
      const commentIdDB = recipe.comments.find(comment => comment._id.toString() === commentId)
      const comment = await Comment.findById(commentIdDB)
      if (!comment) {
        throw new Error('Comment not found')
      }
      return comment
    } catch (error) {
      throw new Error(`Error reading comment: ${error.message}`)
    }
  }

  /**
   * Update specific comment.
   *
   * @param {string} commentId - The comment id.
   * @param {string} updatedCommentText - The updated comment data.
   * @returns {Promise<Document>} - The updated comment.
   */
  async updateComment (commentId, updatedCommentText) {
    try {
      // Update the comment directly in the Comment collection
      const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { comment: updatedCommentText },
        { new: true }
      )
      if (!updatedComment) {
        throw new Error('Comment not found')
      }

      // Trigger the webhook
      this.webhookService.triggerWebhook('comment_updated', updatedComment)

      return updatedComment
    } catch (error) {
      throw new Error(`Error updating comment: ${error.message}`)
    }
  }

  /**
   * Delete specific comment.
   *
   * @param {string} recipeId - The recipe id.
   * @param {string} commentId - The comment id.
   * @returns {Promise<string>} - The message.
   */
  async deleteComment (recipeId, commentId) {
    try {
      // Delete the comment from the Comment collection
      const deletedComment = await Comment.findByIdAndDelete(commentId)
      if (!deletedComment) {
        throw new Error('Comment not found')
      }

      const recipe = await Recipe.findByIdAndUpdate(
        recipeId,
        { $pull: { comments: commentId } }, // Remove the commentId from the comments array
        { new: true }
      )

      if (!recipe) {
        throw new Error('Recipe not found')
      }

      return { message: 'Comment deleted successfully' }
    } catch (error) {
      throw new Error(`Error deleting comment: ${error.message}`)
    }
  }
}
