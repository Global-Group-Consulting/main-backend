import Queue from '../../providers/Queue'

export {QueueJob} from "./QueueJob"

export type QueuesList =
  "send_email"
  | "user_initialize_movements"
  | "agent_commission"

export type QueueConfig = {
  name?: string,
  options?: {
    concurrency?: number
    /** @see https://github.com/agenda/agenda#defining-job-processors */
    priority?: "lowest" | "low" | "normal" | "high" | "highest" | number,
    lockLimit?: number
  },
  action?: string
}

export type QueuesListConfig = Record<QueuesList, QueueConfig>

export interface QueueFileConfig {
  jobsPath: string,
  queuesList: QueuesListConfig
}


export interface IQueue extends Queue {

}


declare global {
  namespace QueueProvider {
    type Config = QueueConfig
    type Job = QueueJob
    type List = QueuesList
  }
}
