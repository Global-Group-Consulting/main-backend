import * as LucidMongo from './@adonisjs/lucid-mongo/src/LucidMongo/Model'
import { ObjectId } from 'mongodb'
import VanillaSerializer from '@adonisjs/lucid-mongo/src/LucidMongo/Serializers/Vanilla'

export class AdonisModel extends LucidMongo {
  declare readonly _id: ObjectId
  declare readonly created_at: string
  declare readonly updated_at: string
  
  static where (key: string, value: any): typeof this
  static where (query: any): typeof this
  
  static with (key: string | string[]): typeof this
  
  static sort (key: string, value: any): typeof this
  static sort (query: any): typeof this
  
  static fetch<T extends AdonisModel> (this: Constructor<T>): Promise<VanillaSerializer<T>>
  
  static find<T extends AdonisModel> (this: Constructor<T>, id: string): Promise<T | null>
  
  static findOrFail<T extends AdonisModel> (this: Constructor<T>, id: string): Promise<T>
  
  static create<T extends AdonisModel> (this: Constructor<T>, data: Partial<T>): Promise<T>
  
  save (): Promise<this>
  
  delete (): Promise<this>
}

