/**
 * Controller for Recipe.
 */
export class RecipeController {
  /**
   * Creates an instance of RecipeController.
   *
   * @param {object} recipeService - The recipe service injected by the dependency injection.
   */
  constructor (recipeService) {
    this.recipeService = recipeService
  }

  /**
   * Post a new recipe.
   *
   * @param {object} req - The HTTP request object.
   * @param {object} res - The HTTP response object.
   */
  async postRecipe (req, res) {
    try {
      const userId = req.userData.sub
      const recipeData = req.body
      const recipe = await this.recipeService.createRecipe(userId, recipeData)
      const baseUrl = `${req.protocol}://${req.get('host')}`
      res.status(201).json({
        recipe,
        links: [
          { rel: 'self', href: `${baseUrl}/recipes/${recipe.id}`, method: 'GET' }, // Note: Changed to GET
          { rel: 'allRecipes', href: `${baseUrl}/recipes`, method: 'GET' },
          { rel: 'update', href: `${baseUrl}/recipes/${recipe.id}`, method: 'PATCH' },
          { rel: 'delete', href: `${baseUrl}/recipes/${recipe.id}`, method: 'DELETE' }
        ]
      })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  /**
   * Get all recipes.
   *
   * @param {object} req - The HTTP request object.
   * @param {object} res - The HTTP response object.
   */
  async getAllRecipes (req, res) {
    try {
      const recipes = await this.recipeService.readAllRecipes()
      const baseUrl = `${req.protocol}://${req.get('host')}`
      const enrichedRecipes = recipes.map(recipe => ({
        recipe,
        links: [
          { rel: 'self', href: `${baseUrl}/recipes/${recipe.id}`, method: 'GET' },
          { rel: 'update', href: `${baseUrl}/recipes/${recipe.id}`, method: 'PATCH' },
          { rel: 'delete', href: `${baseUrl}/recipes/${recipe.id}`, method: 'DELETE' }
        ]
      }))
      res.status(200).json(enrichedRecipes)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  /**
   * Get recipe by id.
   *
   * @param {object} req - The HTTP request object.
   * @param {object} res - The HTTP response object.
   */
  async getRecipeById (req, res) {
    try {
      const recipeId = req.params.recipeId
      const recipe = await this.recipeService.readRecipeById(recipeId)
      const baseUrl = `${req.protocol}://${req.get('host')}`
      res.status(200).json({
        recipe,
        links: [
          { rel: 'allRecipes', href: `${baseUrl}/recipes`, method: 'GET' },
          { rel: 'update', href: `${baseUrl}/recipes/${recipeId}`, method: 'PATCH' },
          { rel: 'delete', href: `${baseUrl}/recipes/${recipeId}`, method: 'DELETE' }
        ]
      })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  /**
   * Update recipe by id.
   *
   * @param {object} req - The HTTP request object.
   * @param {object} res - The HTTP response object.
   */
  async patchRecipe (req, res) {
    try {
      const recipeId = req.params.recipeId
      const recipeData = req.body
      const recipe = await this.recipeService.updateRecipeById(recipeId, recipeData)
      const baseUrl = `${req.protocol}://${req.get('host')}`
      res.status(200).json({
        recipe,
        links: [
          { rel: 'self', href: `${baseUrl}/recipes/${recipeId}`, method: 'GET' },
          { rel: 'allRecipes', href: `${baseUrl}/recipes`, method: 'GET' },
          { rel: 'delete', href: `${baseUrl}/recipes/${recipeId}`, method: 'DELETE' }
        ]
      })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  /**
   * Delete recipe by id.
   *
   * @param {object} req - The HTTP request object.
   * @param {object} res - The HTTP response object.
   */
  async deleteRecipe (req, res) {
    try {
      const recipeId = req.params.recipeId
      await this.recipeService.deleteRecipeById(recipeId)
      const baseUrl = `${req.protocol}://${req.get('host')}`
      res.status(200).json({
        message: 'Recipe deleted',
        links: [
          { rel: 'allRecipes', href: `${baseUrl}/recipes`, method: 'GET' },
          { rel: 'createRecipe', href: `${baseUrl}/recipes`, method: 'POST' }
        ]
      })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }
}
