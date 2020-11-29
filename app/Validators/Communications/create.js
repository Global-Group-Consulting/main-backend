'use strict'

class CommunicationsCreate {
  get rules() {
    return {
      "receiver": "required",
      "content": "required|string",
      "subject": "required|string",
      "type": "required|number",
      "conversationId": "string|objectId",
    }
  }
}

module.exports = CommunicationsCreate
