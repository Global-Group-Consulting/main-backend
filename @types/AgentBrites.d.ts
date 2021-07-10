import AgentsBriteModel from "../app/Models/AgentBrite";
import {ObjectId} from "mongodb";
import AgentBritesType from "../enums/AgentBritesType";
import {Request} from "./Request";

export class AgentBrites extends AgentsBriteModel {
  _id: string

  userId: ObjectId
  requestId: ObjectId

  // Total amount of the request
  requestTotal: number

  // Percentage caught from total amount
  requestPercent: number

  amount: number
  deposit: number
  oldDeposit: number

  type: keyof AgentBritesType

  created_at: Date
  updated_at: Date

  static async addBritesFromRequest(data: Request): Promise<ObjectId>

  static async add(payload: { amount: string, userId: string, motivation: string }): Promise<ObjectId>

  static async remove(payload: { amount: string, userId: string, motivation: string }): Promise<ObjectId>
}
