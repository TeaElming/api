import { Recipe } from '../models/recipe.js'

/**
 * Service class for searching in recipes.
 */
export class SearchService {
  /**
   * Search recipes by query.
   *
   * @param {string} searchTerm - The search query.
   * @returns {Promise<Document[]>} The recipes.
   */
  async searchRecipes (searchTerm) {
    try {
      // Remove special characters in the search term
      const cleanedSearchTerm = searchTerm.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')

      const regex = new RegExp(cleanedSearchTerm, 'i') // 'i' for case-insensitive

      // Find recipes that match the search term in their title or any ingredient's name
      const recipes = await Recipe.find({
        $or: [
          { title: { $regex: regex } },
          { 'ingredients.name': { $regex: regex } }
        ]
      })

      return recipes
    } catch (error) {
      console.error(`Error searching recipes: ${error}`)
      throw new Error(`Error searching recipes: ${error.message}`)
    }
  }
}
