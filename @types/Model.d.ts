import LucidMongo from 'lucid-mongo/src/LucidMongo/Model'
import { ObjectId } from 'mongodb'

export class Model implements LucidMongo {
  _id: ObjectId
  
  static get table (): string
  
  static get connection (): string
  
  static get primaryKey (): string
  
  static get createdAtColumn (): string
  
  static get updatedAtColumn (): string
  
  static get incrementing (): boolean
  
  static get primaryKeyType (): string
  
  static get hidden (): string[]
  
  static get visible (): string[]
  
  static get dates (): string[]
  
  static get computed (): string[]
  
  static boot (): void
  
  static all (): Promise<Model[]>;
  
  static find (id: string): Promise<Model>;
  
  static findOrFail (id: string): Promise<Model>;
  
  static findBy (key: string, value: string): Promise<Model>;
  
  static findByOrFail (key: string, value: string): Promise<Model>;
  
  static first (): Promise<Model>;
  
  static firstOrFail (): Promise<Model>;
  
  static ids (): Promise<string[]>;
  
  static create<T = Model> (data: any): Promise<T>;
  
  static create (data: any): Promise<Model>;
  
  fill (data: any): void;
  
  save (): Promise<Model>;
  
  toJSON (): string;
  
}
