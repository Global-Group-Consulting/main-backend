import RequestStatus from "../enums/RequestStatus"
import RequestTypes from "../enums/RequestTypes"
import WalletTypes from "../enums/WalletTypes"
import CurrencyType from "../enums/CurrencyType"

export interface Request {
  userId: string
  status: typeof RequestStatus
  type: typeof RequestTypes
  wallet: typeof WalletTypes
  amount: number
  availableAmount: number
  currency: typeof CurrencyType
  notes: string

  created_at: Date
  updated_at: Date
  completed_at: Date
  contractNumber: string
  email: string
  firstName: string
  lastName: string
  rejectReason: string
}