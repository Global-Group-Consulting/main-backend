import { User } from '../../User'

export interface RefundReportDto {
  _id: string,
  totalSum: number,
  totals: {
    total: number;
    fromClub: boolean;
  }[],
  user: Pick<User, '_id' | 'firstName' | 'lastName'>
}
