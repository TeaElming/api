/**
 * Controller for comments.
 */
export class CommentsController {
  /**
   * Creates an instance of CommentsController.
   *
   * @param {object} commentsService - The comments service injected by the dependency injection.
   */
  constructor (commentsService) {
    this.commentsService = commentsService
  }

  /**
   * Create new comment.
   *
   * @param {object} req - The HTTP request object, which contains the request query, body, headers, etc.
   * @param {object} res - The HTTP response object used to return data back to the client.
   */
  async postComment (req, res) {
    try {
      const userId = req.userData.sub
      const recipeId = req.params.recipeId
      const comment = req.body.comment
      const newComment = await this.commentsService.createComment(userId, recipeId, comment)
      const baseUrl = `${req.protocol}://${req.get('host')}`

      res.status(200).json({
        newComment,
        links: [
          { rel: 'specificComment', href: `${baseUrl}/recipes/${recipeId}/comments/${newComment.id}`, method: 'GET' },
          { rel: 'update', href: `${baseUrl}/recipes/${recipeId}/comments/${newComment.id}`, method: 'PUT' },
          { rel: 'delete', href: `${baseUrl}/recipes/${recipeId}/comments/${newComment.id}`, method: 'DELETE' },
          { rel: 'allComments', href: `${baseUrl}/recipes/${recipeId}/comments`, method: 'GET' }
        ]
      })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  /**
   * Read comments.
   *
   * @param {object} req - The HTTP request object, which contains the request query, body, headers, etc.
   * @param {object} res - The HTTP response object used to return data back to the client.
   * @memberof CommentsController
   */
  async getComments (req, res) {
    try {
      const recipeId = req.params.recipeId
      const comments = await this.commentsService.readComments(recipeId)
      const baseUrl = `${req.protocol}://${req.get('host')}`

      const enrichedComments = comments.map(comment => ({
        comment,
        links: [
          { rel: 'specificComment', href: `${baseUrl}/recipes/${recipeId}/comments/${comment.id}`, method: 'GET' },
          { rel: 'update', href: `${baseUrl}/recipes/${recipeId}/comments/${comment.id}`, method: 'PUT' },
          { rel: 'delete', href: `${baseUrl}/recipes/${recipeId}/comments/${comment.id}`, method: 'DELETE' },
          { rel: 'newComment', href: `${baseUrl}/recipes/${recipeId}/comments`, method: 'POST' }
        ]
      }))

      res.status(200).json(enrichedComments)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  /**
   * Read specific comment by id.
   *
   * @param {object} req - The HTTP request object, which contains the request query, body, headers, etc.
   * @param {object} res - The HTTP response object used to return data back to the client.
   * @memberof CommentsController
   */
  async getCommentById (req, res) {
    try {
      const recipeId = req.params.recipeId
      const commentId = req.params.commentId
      const comment = await this.commentsService.readCommentById(recipeId, commentId)
      const baseUrl = `${req.protocol}://${req.get('host')}`

      res.status(200).json({
        comment,
        links: [
          { rel: 'update', href: `${baseUrl}/recipes/${recipeId}/comments/${commentId}`, method: 'PUT' },
          { rel: 'delete', href: `${baseUrl}/recipes/${recipeId}/comments/${commentId}`, method: 'DELETE' },
          { rel: 'allComments', href: `${baseUrl}/recipes/${recipeId}/comments`, method: 'GET' },
          { rel: 'newComment', href: `${baseUrl}/recipes/${recipeId}/comments`, method: 'POST' }
        ]
      })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  /**
   * Update a comment.
   *
   * @param {object} req - The HTTP request object, which contains the request query, body, headers, etc.
   * @param {object} res - The HTTP response object used to return data back to the client.
   */
  async putComment (req, res) {
    try {
      const recipeId = req.params.recipeId
      const commentId = req.params.commentId
      const comment = req.body.comment
      const updatedComment = await this.commentsService.updateComment(commentId, comment)
      const baseUrl = `${req.protocol}://${req.get('host')}`

      res.status(200).json({
        updatedComment,
        links: [
          { rel: 'specificComment', href: `${baseUrl}/recipes/${recipeId}/comments/${updatedComment.id}`, method: 'GET' },
          { rel: 'newComment', href: `${baseUrl}/recipes/${recipeId}/comments/`, method: 'POST' },
          { rel: 'delete', href: `${baseUrl}/recipes/${recipeId}/comments/${updatedComment.id}`, method: 'DELETE' },
          { rel: 'allComments', href: `${baseUrl}/recipes/${recipeId}/comments`, method: 'GET' }
        ]
      })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  /**
   * Delete a comment.
   *
   * @param {object} req - The HTTP request object, which contains the request query, body, headers, etc.
   * @param {object} res - The HTTP response object used to return data back to the client.
   */
  async deleteComment (req, res) {
    try {
      const recipeId = req.params.recipeId
      const commentId = req.params.commentId
      await this.commentsService.deleteComment(recipeId, commentId)
      const baseUrl = `${req.protocol}://${req.get('host')}`

      res.status(200).json({
        message: 'Comment deleted successfully',
        links: [
          { rel: 'newComment', href: `${baseUrl}/recipes/${recipeId}/comments/`, method: 'POST' },
          { rel: 'allComments', href: `${baseUrl}/recipes/${recipeId}/comments`, method: 'GET' }
        ]
      })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }
}
