/**
 * WebhookController class
 */
export class WebhookController {
  /**
   * Creates an instance of AuthController.
   *
   * @param {object} webhookService - The authentication service injected into the controller.
   */
  constructor (webhookService) {
    this.webhookService = webhookService
  }

  /**
   * Register a new webhook.
   *
   * @param {object} req - The HTTP request object.
   * @param {object} res - The HTTP response object.
   */
  async registerWebhook (req, res) {
    try {
      const userId = req.userData.sub
      const webhookData = req.body

      const webhook = await this.webhookService.registerWebhook(webhookData, userId)

      const baseUrl = `${req.protocol}://${req.get('host')}/webhooks`

      // Trigger webhook_added event
      await this.webhookService.triggerWebhook('webhook_added', { webhookId: webhook._id, userId })

      res.status(201).json({
        message: 'Webhook registered successfully',
        webhook,
        links: [
          { rel: 'self', method: 'POST', href: `${baseUrl}/${webhook._id}` },
          { rel: 'delete', method: 'DELETE', href: `${baseUrl}/${webhook._id}` }
        ]
      })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  /**
   * Remove a webhook.
   *
   * @param {object} req - The HTTP request object.
   * @param {object} res - The HTTP response object.
   */
  async removeWebhook (req, res) {
    try {
      const userId = req.userData.sub // User ID from request
      const { webhookId } = req.params // Webhook ID is passed as a URL parameter

      const webhook = await this.webhookService.removeWebhook(webhookId, userId)

      const baseUrl = `${req.protocol}://${req.get('host')}/webhooks`

      res.status(201).json({
        message: 'Webhook deleted successfully',
        webhook,
        links: [
          { rel: 'register', method: 'POST', href: `${baseUrl}/${webhook._id}` },
          { rel: 'self', method: 'DELETE', href: `${baseUrl}/${webhook._id}` }
        ]
      })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }
}
