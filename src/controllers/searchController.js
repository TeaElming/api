/**
 * Search controller.
 */
export class SearchController {
  /**
   * Creates an instance of SearchController.
   *
   * @param {object} recipeService - The recipe service injected by the dependency injection.
   */
  constructor (recipeService) {
    this.recipeService = recipeService
  }

  /**
   * Search recipes by title or ingredients.
   *
   * @param {object} req - The HTTP request object.
   * @param {object} res - The HTTP response object.
   * @returns {Promise<void>} The HTTP response.
   */
  async getRecipes (req, res) {
    try {
      const searchTerm = req.query.search
      if (!searchTerm) {
        return res.status(400).json({ message: 'Search term is required.' })
      }

      const results = await this.recipeService.searchRecipes(searchTerm)
      const baseUrl = `${req.protocol}://${req.get('host')}`

      // Enrich the search results with HATEOAS links for each recipe
      const enrichedResults = results.map(recipe => ({
        recipe,
        links: [
          { rel: 'view', href: `${baseUrl}/recipes/${recipe.id}`, method: 'GET' },
          { rel: 'addToFavorites', href: `${baseUrl}/favorites/${recipe.id}`, method: 'POST' },
          { rel: 'removeFromFavorites', href: `${baseUrl}/favorites/${recipe.id}`, method: 'DELETE' }
        ]
      }))

      res.status(200).json(enrichedResults)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }
}
