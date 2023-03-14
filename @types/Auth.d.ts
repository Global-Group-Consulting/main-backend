import { User } from './User'
import AuthClass from '@adonisjs/auth/src/Auth/index.js'

export interface Auth extends AuthClass {
  user: User,
}
