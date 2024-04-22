/* eslint-disable jsdoc/check-indentation */
/* eslint-disable jsdoc/check-tag-names */
import express from 'express'
import 'reflect-metadata'
import container from '../../../config/inversify.config.js'
import IDENTIFIERS from '../../../config/identifiers.js'

export const authRouter = express.Router()

/**
 * @swagger
 * /:
 *  get:
 *    summary: Welcome message for the API version
 *    responses:
 *      200:
 *        description: Shows a welcome message
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Welcome to your auth router!
 */
authRouter.get('/', (req, res) => {
  res.json({ message: 'Welcome to your auth router!' })
})

/**
 * @swagger
 * /login:
 *  post:
 *    summary: User login
 *    description: Authenticates a user by their username and password.
 *    tags:
 *      - Authentication
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - username
 *              - password
 *            properties:
 *              username:
 *                type: string
 *                description: The username of the user. For this application, it is the user's email address.
 *                example: user@example.com
 *              password:
 *                type: string
 *                description: The password of the user. Must be sent over a secure connection.
 *                format: password
 *                example: pass1234
 *    responses:
 *      200:
 *        description: Login successful. Returns user details and a JWT token.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                user:
 *                  $ref: '#/components/schemas/User'
 *                token:
 *                  type: string
 *                  description: JWT token for authentication in subsequent requests.
 *                  example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *      401:
 *        description: Authentication failed. Incorrect username or password.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Incorrect username or password.
 *      400:
 *        description: Bad request (e.g., missing required fields, invalid values).
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Missing required fields.
 */
authRouter.post('/login', async (req, res) => {
  const authController = container.get(IDENTIFIERS.AuthController)
  await authController.login(req, res)
})
