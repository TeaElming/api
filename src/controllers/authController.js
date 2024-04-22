/**
 * AuthController
 */
export class AuthController {
  /**
   * Creates an instance of AuthController.
   *
   * @param {object} authService - The authentication service injected into the controller.
   */
  constructor (authService) {
    this.authService = authService
  }

  /**
   * Logs in a user.
   *
   * @param {object} req - The HTTP request object, which contains the request query, body, headers, etc.
   * @param {object} res - The HTTP response object used to return data back to the client.
   * @returns {Promise<*>} The response object or the next function.
   */
  async login (req, res) {
    try {
      const { username, password } = req.body
      const token = await this.authService.loginUser(username, password)
      const baseUrl = `${req.protocol}://${req.get('host')}`
      return res.status(200).json({
        token,
        links: [
          { rel: 'self', href: `${baseUrl}/auth/login`, method: 'POST' }
        ]
      })
    } catch (error) {
      return res.status(401).json({ message: error.message })
    }
  }
}
