import ResolverManager from './src/Resolver/Manager'
import ServiceProvider = require('./src/ServiceProvider')

declare module '@adonisjs/fold' {
  export const ioc: import('./src/Ioc')
  
  export const registrar: import('./src/Registrar')
  export const resolver: ResolverManager
  export { ServiceProvider }
}
