import { User } from '../models/user.js'

/**
 * Service class for User model.
 */
export class UserService {
  /**
   * Create new user.
   *
   * @param {string} email - The email.
   * @param {string} username - The username.
   * @param {string} password - The password.
   * @returns {Promise<Document>} The created user.
   * @memberof UserService
   */
  async createUser (email, username, password) {
    if (await User.findOne({ email })) {
      throw new Error('Email already exists')
    } else if (await User.findOne({ username })) {
      throw new Error('Username already exists')
    } else {
      const user = new User({
        email,
        username,
        password
      })
      return await user.save()
    }
  }

  /**
   * Generalized method to update a user by ID.
   *
   * @param {string} id - The user ID.
   * @param {object} updates - Object containing the fields to update.
   * @returns {Promise<Document>} The updated user.
   */
  async updateUserById (id, updates) {
    try {
      const user = await User.findById(id)
      if (!user) {
        throw new Error('User not found')
      }

      // Apply updates to the user document
      if (updates.email) {
        // Ensure email uniqueness
        const existingEmail = await User.findOne({ email: updates.email })
        if (existingEmail && existingEmail._id.toString() !== id) {
          throw new Error('Email already exists')
        }
        user.email = updates.email
      }

      if (updates.username) {
        // Ensure username uniqueness
        const existingUsername = await User.findOne({ username: updates.username })
        if (existingUsername && existingUsername._id.toString() !== id) {
          throw new Error('Username already exists')
        }
        user.username = updates.username
      }

      if (updates.password) {
        // Password will be hashed automatically by the pre-save middleware
        user.password = updates.password
      }

      // Save the user to trigger the pre-save middleware for password hashing
      await user.save()

      return user
    } catch (error) {
      throw new Error('Error updating user: ' + error.message)
    }
  }

  /**
   * Delete user by id.
   *
   * @param {string} id - The user id.
   * @returns {Promise<Document>} The deleted user.
   * @memberof UserService
   */
  async deleteUser (id) {
    try {
      const deletedUser = await User.findByIdAndDelete(id)
      if (!deletedUser) {
        throw new Error('User not found')
      }
      return deletedUser
    } catch (error) {
      throw new Error('Error deleting user: ' + error.message)
    }
  }
}
