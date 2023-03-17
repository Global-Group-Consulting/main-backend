// @ts-ignore
// import * as LucidMongo from 'lucid-mongo/src/LucidMongo/Model/index.js';

import { ObjectId } from 'mongodb'
import BelongsTo from './BelongsTo'

export class AdonisModel {
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
  
  static findOrFail (id: string): Promise<typeof AdonisModel>;
  
  static findBy (key: string, value: string): Promise<typeof AdonisModel>;
  
  static findByOrFail (key: string, value: string): Promise<typeof AdonisModel>;
  
  static first (): Promise<typeof this>;
  
  static firstOrFail (): Promise<typeof AdonisModel>;
  
  static ids (): Promise<string[]>;
  
  static create<T = this> (data: any): Promise<T>;
  
  static create (data: any): Promise<typeof AdonisModel>;
  
  static where (query: any): typeof AdonisModel;
  
  static with (load: string | string[]): typeof AdonisModel;
  
  static fetch (): Promise<typeof this[]>;
  
  static sort (query: any): typeof AdonisModel;
  
  fill (data: any): void;
  
  save (): Promise<this>;
  
  delete (): Promise<void>;
  
  toJSON (): string;
  
  // relation methods
  belongsTo (related: string, foreignKey: string, localKey: string): BelongsTo;
  
}
