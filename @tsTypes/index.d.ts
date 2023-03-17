import Request from './@adonisjs/framework/src/Request'
import Response from './@adonisjs/framework/src/Response'
import View from './@adonisjs/framework/src/View'
import Auth from './@adonisjs/auth/src/Auth/index'

import { User } from '../app/Models/User'
import { AdonisModel } from './AdonisModel'
import CalendarEventComment from '../app/Models/CalendarEventComment'
import CalendarEventCommentPolicy from '../app/Policies/CalendarEventCommentPolicy'
import AclForbiddenException from '../app/Exceptions/Acl/AclForbiddenException'
import { ControllerContext } from '../app/Controllers/Http/Controller'

// Generic
declare global {
  interface Constructor<M> {
    new (...args: any[]): M
  }
  
  function use<T> (namespace: string): T
  
  interface ControllerContext<P = any> {
    request: Request
    response: Response
    view: View
    params: P
    auth: Auth & {
      user: User
    }
  }
}

// Models
declare global {
  function use (namespace: 'Model'): typeof AdonisModel
  
  function use (namespace: 'App/Models/CalendarEventComment'): typeof CalendarEventComment
}

// Exceptions
declare global {
  function use (namespace: 'App/Exceptions/Acl/AclForbiddenException'): AclForbiddenException
  
}

// Policies
declare global {
  function use (namespace: 'App/Policies/CalendarEventCommentPolicy'): CalendarEventCommentPolicy
  
}
