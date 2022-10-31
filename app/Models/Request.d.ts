import { GetCountersDto } from '../../@types/dto/GetCounters.dto'

export interface Request {
  getCounters (match: any): GetCountersDto[]
}


