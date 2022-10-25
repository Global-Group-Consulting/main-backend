import { User } from './User'
import AuthClass from '@adonisjs/auth/src/Auth/index'

export interface Auth extends AuthClass {
  user: User,
}
