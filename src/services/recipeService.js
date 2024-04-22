import { Recipe } from '../models/recipe.js'

/**
 * Service class for Recipe model.
 */
export class RecipeService {
  /**
   * Constructor for the RecipeService class.
   *
   * @param {object} webhookService - The webhook service injected by the dependency injection.
   */
  constructor (webhookService) {
    this.webhookService = webhookService
  }

  /**
   * Create a new recipe.
   *
   * @param {string} userId - The user ID.
   * @param {object} recipeData - The recipe data.
   * @returns {Promise<Document>} The created recipe.
   */
  async createRecipe (userId, recipeData) {
    try {
      // Automatically set the postedBy field to the current user's ID
      const completeRecipeData = { ...recipeData, postedBy: userId }
      const recipe = new Recipe(completeRecipeData)
      await recipe.save()

      // Trigger the webhook
      await this.webhookService.triggerWebhook('recipe_added', recipe)

      return recipe
    } catch (error) {
      throw new Error(`Error creating recipe: ${error.message}`)
    }
  }

  /**
   * Read all recipes.
   *
   * @returns {Promise<Document[]>} All recipes.
   */
  async readAllRecipes () {
    try {
      const recipes = await Recipe.find()
      return recipes
    } catch (error) {
      throw new Error(`Error reading recipes: ${error.message}`)
    }
  }

  /**
   * Read recipe by id.
   *
   * @param {string} recipeId - The recipe id.
   * @returns {Promise<Document>} The recipe.
   */
  async readRecipeById (recipeId) {
    try {
      const recipe = await Recipe.findById(recipeId)
      if (!recipe) {
        throw new Error('Recipe not found')
      }
      return recipe
    } catch (error) {
      throw new Error(`Error reading recipe: ${error.message}`)
    }
  }

  /**
   * Update recipe by id.
   *
   * @param {string} recipeId - The recipe id.
   * @param {object} recipeData - The recipe data.
   * @returns {Promise<Document>} The updated recipe.
   */
  async updateRecipeById (recipeId, recipeData) {
    try {
      const recipe = await Recipe.findById(recipeId)
      if (!recipe) {
        throw new Error('Recipe not found')
      }

      const validFields = Object.keys(Recipe.schema.paths)
      const invalidFields = []

      Object.keys(recipeData).forEach((key) => {
        if (validFields.includes(key)) {
          recipe[key] = recipeData[key]
        } else {
          // Collecting invalid fields for error handling.
          invalidFields.push(key)
        }
      })

      // If there are any invalid fields, throw an error
      if (invalidFields.length > 0) {
        throw new Error(`Invalid fields provided: ${invalidFields.join(', ')}.`)
      }

      await recipe.save()
      // Trigger the webhook
      await this.webhookService.triggerWebhook('recipe_updated', recipe)

      return recipe
    } catch (error) {
      throw new Error(`Error updating recipe: ${error.message}`)
    }
  }

  /**
   * Delete recipe by id.
   *
   * @param {string} recipeId - The recipe id.
   */
  async deleteRecipe (recipeId) {
    try {
      const recipe = await Recipe.findById(recipeId)
      if (!recipe) {
        throw new Error('Recipe not found')
      }
      await recipe.remove()
    } catch (error) {
      throw new Error(`Error deleting recipe: ${error.message}`)
    }
  }
}
