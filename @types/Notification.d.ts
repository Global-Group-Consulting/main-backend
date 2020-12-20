import {ObjectId} from "mongodb"
import NotificationTypes from "../enums/NotificationTypes"

export interface INotification {
  // Default fields
  _id: ObjectId,
  created_at: Date
  updated_at: Date

  // Custom fields
  type: NotificationTypes

  /**
   * Who will receive the notification
   */
  receiverId: ObjectId

  /**
   * From who is coming this notification.
   *
   * @Example
   * for a chat, the one who wrote the message
   */
  senderId: ObjectId

  /**
   * Date when the user read the notification
   */
  readOn: Date

  /**
   * Date when the notification was delivered to the user.
   */
  notifiedOn: Date


}
