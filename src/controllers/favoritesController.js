/**
 * Favorites controller.
 */
export class FavoritesController {
  /**
   * Creates an instance of FavoritesController.
   *
   * @param {object} favoritesService - The favorites service injected by the dependency injection.
   */
  constructor (favoritesService) {
    this.favoritesService = favoritesService
  }

  /**
   * Get the favorites of the user.
   *
   * @param {object} req - The HTTP request object.
   * @param {object} res - The HTTP response object.
   */
  async getFavorites (req, res) {
    try {
      const userId = req.userData.sub
      const favorites = await this.favoritesService.getFavorites(userId)
      const baseUrl = `${req.protocol}://${req.get('host')}`

      const enrichedFavorites = favorites.map(favorite => ({
        favorite,
        links: {
          viewRecipe: { href: `${baseUrl}/recipes/${favorite.id}`, method: 'GET' },
          removeFromFavorites: { href: `${baseUrl}/favorites/${favorite.id}`, method: 'DELETE' }
        }
      }))

      res.status(200).json({
        favorites: enrichedFavorites,
        links: {
          addFavorite: { href: `${baseUrl}/${userId}/favorites/{recipeId}`, method: 'POST' }
        }
      })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  /**
   * Add a recipe to the user's favorites.
   *
   * @param {object} req - The HTTP request object.
   * @param {object} res - The HTTP response object.
   */
  async postFavorite (req, res) {
    try {
      const userId = req.userData.sub
      const recipeId = req.params.recipeId
      await this.favoritesService.addFavorite(userId, recipeId)
      const baseUrl = `${req.protocol}://${req.get('host')}`

      res.status(200).json({
        message: 'Recipe added to favorites',
        links: {
          viewFavorites: { href: `${baseUrl}/${userId}/favorites`, method: 'GET' },
          viewRecipe: { href: `${baseUrl}/recipes/${recipeId}`, method: 'GET' },
          removeFromFavorites: { href: `${baseUrl}/favorites/${recipeId}`, method: 'DELETE' }
        }
      })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  /**
   * Remove a recipe from the user's favorites.
   *
   * @param {object} req - The HTTP request object.
   * @param {object} res - The HTTP response object.
   */
  async deleteFavorite (req, res) {
    try {
      const userId = req.userData.sub
      const recipeId = req.params.recipeId
      await this.favoritesService.removeFavorite(userId, recipeId)
      const baseUrl = `${req.protocol}://${req.get('host')}`

      res.status(200).json({
        message: 'Recipe removed from favorites',
        links: {
          viewFavorites: { href: `${baseUrl}/${userId}/favorites`, method: 'GET' },
          addBackToFavorites: { href: `${baseUrl}/${userId}/favorites/${recipeId}`, method: 'POST' }
        }
      })
    } catch (error) {
      res.status(400).json({ message: error.message.FavoritesController })
    }
  }
}
