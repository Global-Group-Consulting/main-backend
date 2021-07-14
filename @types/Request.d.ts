import RequestStatus from "../enums/RequestStatus"
import RequestTypes from "../enums/RequestTypes"
import WalletTypes from "../enums/WalletTypes"
import CurrencyType from "../enums/CurrencyType"
import RequestModel from "../app/Models/Request"
import {ObjectId} from "mongodb";


export interface Request extends RequestModel {
  _id: ObjectId
  userId: string
  status: typeof RequestStatus
  type: typeof RequestTypes
  wallet: typeof WalletTypes

  amount: number
  amountOriginal: number
  amountBrite: number
  amountEuro: number
  briteConversionPercentage: number

  availableAmount: number
  currency: typeof CurrencyType
  notes: string
  movementId: string
  briteMovementId: string
  targetUserId: string
  cancelReason: string

  created_at: Date
  updated_at: Date
  completed_at: Date
  contractNumber: string
  email: string
  firstName: string
  lastName: string
  rejectReason: string

  typeClub: boolean
  autoWithdrawlAll?: boolean
  autoWithdrawlAllRecursively?: boolean
}
