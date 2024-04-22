import { User } from '../models/user.js'

/**
 * Service class for favorites.
 */
export class FavoriteService {
  /**
   * Get the favorites of the user.
   *
   * @param {string} userId - The user id.
   * @returns {Promise<string[]>} The favorites.
   */
  async getFavorites (userId) {
    const user = await User.findById(userId)
    if (!user) {
      throw new Error('User not found')
    }
    return user.favorites
  }

  /**
   * Add a recipe to the user's favorites.
   *
   * @param {string} userId - The user id.
   * @param {string} recipeId - The recipe id.
   */
  async addFavorite (userId, recipeId) {
    try {
      const user = await User.findById(userId)
      if (!user) {
        throw new Error('User not found')
      }
      if (user.favorites.includes(recipeId)) {
        throw new Error('Recipe already in favorites')
      }
      console.log(recipeId)
      user.favorites.push(recipeId)
      await user.save()
    } catch (error) {
      throw new Error(`Error adding favorite: ${error.message}`)
    }
  }

  /**
   * Remove a recipe from the user's favorites.
   *
   * @param {string} userId - The user id.
   * @param {string} recipeId - The recipe id.
   */
  async removeFavorite (userId, recipeId) {
    const user = await User.findById(userId)
    if (!user) {
      throw new Error('User not found')
    }
    if (!user.favorites.includes(recipeId)) {
      throw new Error('Recipe not in favorites')
    }
    console.log(user.favorites)
    user.favorites = user.favorites.filter((id) => id.toString() !== recipeId) // Note: Added toString() - don't forget this one!
    await user.save()
  }
}
