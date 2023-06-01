import AdonisRequest from './@adonisjs/framework/src/Request'
import AdonisResponse from './@adonisjs/framework/src/Response'
import View from './@adonisjs/framework/src/View'
import Auth from './@adonisjs/auth/src/Auth/index'

import { User } from '../app/Models/User'
import { Movement } from '../app/Models/Movement'
import { Analytic } from '../app/Models/Analytic'
import { AdonisModel } from './AdonisModel'
import { CalendarEventComment } from '../app/Models/CalendarEventComment'
import CalendarEventCommentPolicy from '../app/Policies/CalendarEventCommentPolicy'
import AclForbiddenException from '../app/Exceptions/Acl/AclForbiddenException'
import { LaravelQueueProvider } from '../providers/LaravelQueue/LaravelQueue'

// Generic
declare global {
  interface Constructor<M> {
    new (...args: any[]): M
  }
  
  // Models
  function use (namespace: 'Model'): typeof AdonisModel
  
  function use (namespace: 'App/Models/User'): typeof User
  function use (namespace: 'App/Models/Movement'): typeof Movement
  function use (namespace: 'App/Models/CalendarEventComment'): typeof CalendarEventComment
  function use (namespace: 'App/Models/Analytic'): typeof Analytic
  
  // Exceptions
  function use (namespace: 'App/Exceptions/Acl/AclForbiddenException'): AclForbiddenException
  
  // Policies
  function use (namespace: 'App/Policies/CalendarEventCommentPolicy'): CalendarEventCommentPolicy
  
  // Filters
  function use (namespace: 'App/Filters/ReportWithdrawalFilters.map'): typeof import('../app/Filters/ReportWithdrawalFilters.map')
  
  // Providers
  function use (namespace: 'LaravelQueueProvider'): LaravelQueueProvider
  
  // Generic
  function use<T> (namespace: string): T
  
  interface ControllerContext<P = any> {
    request: AdonisRequest
    response: AdonisResponse
    view: View
    params: P
    auth: Auth & {
      user: User
    }
  }
}

