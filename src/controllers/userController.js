/**
 * Controller for User.
 */
export class UserController {
  /**
   * Creates an instance of UserController.
   *
   * @param {object} userService - The user service injected by the dependency injection.
   */
  constructor (userService) {
    this.userService = userService
  }

  /**
   * Post a new user.
   *
   * @param {object} req - The HTTP request object.
   * @param {object} res - The HTTP response object.
   */
  async postUser (req, res) {
    try {
      const userData = req.body
      const user = await this.userService.createUser(userData.email, userData.username, userData.password)
      const baseUrl = `${req.protocol}://${req.get('host')}`

      res.status(201).json({
        user,
        links: [
          { rel: 'self', href: `${baseUrl}/users/${user.id}`, method: 'GET' },
          { rel: 'updateUser', href: `${baseUrl}/users/${user.id}`, method: 'PATCH' },
          { rel: 'deleteUser', href: `${baseUrl}/users/${user.id}`, method: 'DELETE' }
        ]
      })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  /**
   * Update user data.
   *
   * @param {object} req - The HTTP request object.
   * @param {object} res - The HTTP response object.
   */
  async patchUserById (req, res) {
    try {
      const userId = req.userData.sub
      const userData = req.body
      const user = await this.userService.updateUserById(userId, userData)
      const baseUrl = `${req.protocol}://${req.get('host')}`

      res.status(200).json({
        user,
        links: [
          { rel: 'viewUser', href: `${baseUrl}/users/${userId}`, method: 'GET' },
          { rel: 'deleteUser', href: `${baseUrl}/users/${userId}`, method: 'DELETE' }
        ]
      })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  /**
   * Delete user by id.
   *
   * @param {object} req - The HTTP request object.
   * @param {object} res - The HTTP response object.
   */
  async deleteUserById (req, res) {
    try {
      const userId = req.userData.sub
      await this.userService.deleteUserById(userId)
      const baseUrl = `${req.protocol}://${req.get('host')}`

      res.status(200).json({
        message: 'User deleted',
        links: [
          { rel: 'createUser', href: `${baseUrl}/users`, method: 'POST' }
        ]
      })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }
}
