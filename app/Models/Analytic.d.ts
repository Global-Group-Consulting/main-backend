import { AdonisModel } from '../../@types/AdonisModel'

export class Analytic extends AdonisModel {
  declare sessionDate: number
  declare sessionId: string
  declare user: Pick<User, 'id' | 'role' | 'roles'>
  declare userId: Pick<User, 'id' | 'role' | 'roles'>
  declare timers: ITimer[]
  declare totalTime: number
}
