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
  
  static all (): Promise<{ rows: typeof this[] }>;
  
  static find (id: string): Promise<typeof this>;
  
  static findOrFail (id: string): Promise<typeof this>;
  
  static findBy (key: string, value: string): Promise<typeof this>;
  
  static findByOrFail (key: string, value: string): Promise<typeof this>;
  
  static first (): Promise<typeof this>;
  
  static firstOrFail (): Promise<typeof this>;
  
  static ids (): Promise<string[]>;
  
  static create<T = this> (data: any): Promise<T>;
  
  static create (data: any): Promise<typeof this>;
  
  static where (query: any): typeof Model;
  
  static with (load: string | string[]): typeof Model;
  
  static fetch (): Promise<typeof this[]>;
  
  static sort (query: any): typeof Model;
  
  fill (data: any): void;
  
  save (): Promise<this>;
  
  delete (): Promise<void>;
  
  toJSON (): string;
  
}
