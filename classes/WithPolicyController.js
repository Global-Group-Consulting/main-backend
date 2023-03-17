"use strict";
const { resolver } = require('@adonisjs/fold');
class WithPolicyController {
    constructor() {
        const policyClass = this.constructor.name.replace('Controller', 'Policy');
        if (!resolver._directories['policies']) {
            resolver._directories['policies'] = 'Policies';
        }
        this._policies = policyClass;
    }
    _checkPolicy(fnName, ctx) {
        if (!this._policies) {
            return true;
        }
        try {
            /**
             * Using the resolver to get the policy method by a singleton instance
             * @type {{method: (ctx: import('@adonisjs/framework/src/Request').HttpContextContract) => boolean}}
             */
            const res = resolver.forDir('policies').resolveFunc(this._policies + '.' + fnName);
            return res.method(ctx);
        }
        catch (e) {
            return true;
        }
    }
}
module.exports = WithPolicyController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV2l0aFBvbGljeUNvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJXaXRoUG9saWN5Q29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO0FBRTlDLE1BQU0sb0JBQW9CO0lBR3hCO1FBQ0UsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxRQUFRLENBQUMsQ0FBQTtRQUV6RSxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUN0QyxRQUFRLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxHQUFHLFVBQVUsQ0FBQTtTQUMvQztRQUVELElBQUksQ0FBQyxTQUFTLEdBQUcsV0FBVyxDQUFBO0lBQzlCLENBQUM7SUFFRCxZQUFZLENBQUUsTUFBYyxFQUFFLEdBQXNCO1FBQ2xELElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ25CLE9BQU8sSUFBSSxDQUFBO1NBQ1o7UUFFRCxJQUFJO1lBQ0Y7OztlQUdHO1lBQ0gsTUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxHQUFHLEdBQUcsTUFBTSxDQUFDLENBQUE7WUFFbEYsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1NBQ3ZCO1FBQUMsT0FBTyxDQUFDLEVBQUU7WUFDVixPQUFPLElBQUksQ0FBQTtTQUNaO0lBQ0gsQ0FBQztDQUVGO0FBRUQsaUJBQVMsb0JBQW9CLENBQUEifQ==