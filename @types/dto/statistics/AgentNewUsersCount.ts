import { User } from '../../User'

export interface AgentNewUsersCount {
  _id: string,
  totalUsers: number;
  agent: Pick<User, '_id' | 'firstName' | 'lastName' | 'email' | 'contractNumber' | 'clubPack' | 'referenceAgent'>;
}
