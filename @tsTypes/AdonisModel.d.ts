import * as LucidMongo from './@adonisjs/lucid-mongo/src/LucidMongo/Model'
import { ObjectId } from 'mongodb'

export class AdonisModel extends LucidMongo {
  declare _id: ObjectId
  declare created_at: string
  declare updated_at: string
  
  static where (key: string, value: any): typeof this
  static where (query: any): typeof this
  
  static with (key: string | string[]): typeof this
  
  static sort (key: string, value: any): typeof this
  static sort (query: any): typeof this
  
  static fetch<T extends AdonisModel> (this: Constructor<T>): Promise<T[]>
  
  static find<T extends AdonisModel> (this: Constructor<T>, id: string): Promise<T | null>
  
  static findOrFail<T extends AdonisModel> (this: Constructor<T>, id: string): Promise<T>
  
  save (): Promise<this>
  
  delete (): Promise<this>
}

