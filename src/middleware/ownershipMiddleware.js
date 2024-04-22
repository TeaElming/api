import { Recipe } from '../models/recipe.js'

/**
 * Middleware to check ownership for recipes.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {Function} next - The next function.
 * @returns {void}
 */
export const verifyOwnership = async (req, res, next) => {
  const userId = req.userData.sub
  const recipeId = req.params.recipeId

  try {
    const recipe = await Recipe.findById(recipeId)
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' })
    }
    if (recipe.postedBy.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized' })
    }
    next()
  } catch (error) {
    return res.status(500).json({ message: 'Error verifying ownership: ' + error.message })
  }
}
