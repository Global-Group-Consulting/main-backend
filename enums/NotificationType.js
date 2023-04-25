const { BasicEnum } = require('../classes/BasicEnum')

class NotificationType extends BasicEnum {
  /**
   * @enum
   */
  constructor () {
    super('NotificationType')
    
    this.USER_VALIDATE = "userValidate"
    this.USER_INCOMPLETE = "userIncomplete"
    this.USER_REVALIDATE = "userRevalidate"
    this.USER_SIGN_REQUEST = "userSign_request"
    this.USER_APPROVED = "userApproved"
    
    this.REQUEST_DEPOSIT = "requestDeposit"
    this.REQUEST_DEPOSIT_COLLECT = "requestDepositCollect"
    this.REQUEST_APPROVED = "requestApproved"
    this.REQUEST_REJECTED = "requestRejected"
    this.REQUEST_CANCELLED = "requestCancelled"
    this.REQUEST_GOLD = "requestGold"
    
    this.MESSAGE_REPORT = "messageReport"
    this.MESSAGE_CHAT = "messageChat"
    this.MESSAGE_COMMUNICATION = "messageCommunication"
    
    this.PASSWORD_RECOVER = "passwordRecover"
    this.PASSWORD_FORGOT = "passwordForgot"
  }
}

/**
 * @export {{test: string}}
 */
module.exports = new NotificationType()
