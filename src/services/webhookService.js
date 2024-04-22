import fetch from 'node-fetch'
import { Webhook } from '../models/webhook.js'

/**
 * Service for handling webhooks.
 */
export class WebhookService {
  /**
   * Trigger all webhooks for the given event type with the given data.
   *
   * @param {string} eventType - The event type to trigger the webhook for
   * @param {string} data - The data to send to the webhook
   */
  async triggerWebhook (eventType, data) {
    // Retrieve all webhooks for the given event type
    const webhooks = await Webhook.find({ eventType })

    // Prepare the payload
    const payload = {
      timestamp: Date.now(),
      eventType,
      data
    }

    // Iterate over all webhooks and send them the payload
    webhooks.forEach(webhook => {
      fetch(webhook.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Webhook response status: ${response.status}`)
          }
          return response
        })
        .catch(err => console.error(`Failed to trigger webhook for ${webhook.url}:`, err))
    })
  }

  /**
   * Register a new webhook.
   *
   * @param {object} webhookData - The webhook data to register.
   * @param {string} userId - The ID of the user registering the webhook.
   * @returns {object} The registered webhook.
   */
  async registerWebhook (webhookData, userId) {
    const { url, eventType, secret } = webhookData
    // Additional validation logic can be implemented here if needed
    const webhook = new Webhook({ url, eventType, secret, userId })
    await webhook.save()
    return webhook
  }

  /**
   * Remove a webhook.
   *
   * @param {string} webhookId - The ID of the webhook to remove.
   * @param {string} userId - The ID of the user removing the webhook.
   * @returns {object} The removed webhook.
   */
  async removeWebhook (webhookId, userId) {
    const webhook = await Webhook.findOneAndDelete({ _id: webhookId, userId })
    if (!webhook) {
      throw new Error('Webhook not found or user unauthorized')
    }
    // Optionally trigger a webhook_removed event here if needed
    await this.triggerWebhook('webhook_removed', { webhookId: webhook._id, userId })
    return webhook
  }
}
