import { AdonisModel } from '../../@types/AdonisModel'

export class Movement extends AdonisModel {
  static getReportsData (filters: any): Promise<any>
}
