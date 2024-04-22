import { User } from '../models/user.js'

/**
 * Middleware to check credentials for user.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {Function} next - The next function.
 * @returns {void}
 */
export const verifyUser = async (req, res, next) => {
  const userId = req.userData.sub
  const userTargetId = req.params.id

  try {
    const user = await User.findById(userTargetId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    if (user._id.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized' })
    }
    next()
  } catch (error) {
    return res.status(500).json({ message: 'Error verifying user: ' + error.message })
  }
}
