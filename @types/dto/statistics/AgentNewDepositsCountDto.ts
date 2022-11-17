import { User } from '../../User'

export interface AgentNewDepositsCountDto {
  _id: string,
  totalAmount: number;
  count: number;
  agent: Pick<User, '_id' | 'firstName' | 'lastName' | 'email' | 'contractNumber' | 'clubPack' | 'referenceAgent'>;
}
