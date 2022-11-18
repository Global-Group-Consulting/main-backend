import { User } from '../../User'

export interface WithdrawalDepositReport {
  _id: string,
  total: number
  user: Pick<User, '_id' | 'firstName' | 'lastName'>
}
