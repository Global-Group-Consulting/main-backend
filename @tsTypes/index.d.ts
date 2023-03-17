import { AdonisModel } from './AdonisModel'

declare global {
  
  function use (module: string): typeof AdonisModel
}

declare module '*.lucid-mongo'{
  export class BelongsTo extends AdonisModel {}
};
