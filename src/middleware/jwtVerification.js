import jwt from 'jsonwebtoken'

/**
 * Middleware function to verify a JWT.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {Function} next - The next function.
 * @returns {void}
 */
export const jwtVerification = (req, res, next) => {
  const publicKey = Buffer.from(process.env.JWT_PUBLIC_KEY_BASE64, 'base64').toString('utf-8')

  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      // No Authorization header is present
      return res.status(403).json({ message: 'Access denied. No credentials sent.' })
    }

    const tokenParts = authHeader.split(' ')

    // Ensure the Authorization header is properly formatted
    if (tokenParts[0] !== 'Bearer' || tokenParts.length !== 2) {
      // Authorization header is present but the scheme is not Bearer or the token is missing
      return res.status(401).json({ message: 'Invalid or missing authentication token.' })
    }

    const token = tokenParts[1]

    // Verify the token
    const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] })
    req.userData = decoded
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired authentication token.' })
  }
}
