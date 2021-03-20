import BriteMovementTypes from "../../enums/BriteMovementTypes"
import {ObjectId} from "mongodb";
import {Moment} from "moment";

export interface Brite {
  deposit: number
  depositOld: number

  amountChange: number

  movementType: typeof BriteMovementTypes

  /**
   * Annual semestre that refers to
   * Indicates only if is the first or the second
   */
  referenceSemester: 1 | 2

  notes: string

  requestId: ObjectId
  movementId: ObjectId
  userId: ObjectId

  // User that has created this movement in case is manual
  created_by: ObjectId

  usableFrom: Date
  expiresAt: Date

  id: string
  created_at: Date
  updated_at: Date
}
