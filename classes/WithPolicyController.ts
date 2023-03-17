const { resolver } = require('@adonisjs/fold')

class WithPolicyController {
  _policies
  
  constructor () {
    const policyClass = this.constructor.name.replace('Controller', 'Policy')
    
    if (!resolver._directories['policies']) {
      resolver._directories['policies'] = 'Policies'
    }
    
    this._policies = policyClass
  }
  
  _checkPolicy (fnName: string, ctx: ControllerContext) {
    if (!this._policies) {
      return true
    }
  
    try {
      /**
       * Using the resolver to get the policy method by a singleton instance
       * @type {{method: (ctx: import('@adonisjs/framework/src/Request').HttpContextContract) => boolean}}
       */
      const res = resolver.forDir('policies').resolveFunc(this._policies + '.' + fnName)
      
      return res.method(ctx)
    } catch (e) {
      return true
    }
  }
  
}

export = WithPolicyController
