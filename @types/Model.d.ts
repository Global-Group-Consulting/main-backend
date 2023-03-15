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
  
  static find (id: string): Promise<this>;
  
  static findOrFail (id: string): Promise<this>;
  
  static findBy (key: string, value: string): Promise<this>;
  
  static findByOrFail (key: string, value: string): Promise<typeof this>;
  
  static first (): Promise<this>;
  
  static firstOrFail (): Promise<this>;
  
  static ids (): Promise<string[]>;
  
  static create<T = this> (data: any): Promise<T>;
  
  static create (data: any): Promise<this>;
  
  static where (query: any): this;
  
  static with (load: string | string[]): this;
  
  static fetch (): Promise<Model[]>;
  
  static sort (query: any): this;
  
  fill (data: any): void;
  
  save (): Promise<this>;
  
  delete (): Promise<void>;
  
  toJSON (): string;
  
}
