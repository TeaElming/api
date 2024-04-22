import jwt from 'jsonwebtoken'
import { User } from '../models/user.js'

/**
 * Service class for authentication.
 */
export class AuthService {
  /**
   * Creates an instance of AuthService.
   * Reads the private and public keys from the environment.
   */
  constructor () {
    this.privateKey = Buffer.from(process.env.JWT_PRIVATE_KEY_BASE64, 'base64').toString('utf-8')
    this.publicKey = Buffer.from(process.env.JWT_PUBLIC_KEY_BASE64, 'base64').toString('utf-8')
  }

  /**
   * Logs in a user and creates a JWT.
   *
   * @param {string} username - The username.
   * @param {string} password - The password.
   * @returns {Promise<string>} The JWT.
   * @memberof AuthService
   */
  async loginUser (username, password) {
    try {
      const user = await User.authenticate(username, password)
      if (!user) {
        throw new Error('Invalid username or password')
      }
      // Consider not sending email, what is the purpose?
      const payload = {
        sub: user.id,
        username: user.username,
        email: user.email
      }

      const token = jwt.sign(payload, this.privateKey, {
        algorithm: 'RS256',
        expiresIn: '10h' // Update later
      })
      return token
    } catch (error) {
      throw new Error('Error logging in: ' + error.message)
    }
  }
}
