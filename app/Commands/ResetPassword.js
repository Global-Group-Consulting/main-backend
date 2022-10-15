'use strict'

const { Command } = require('@adonisjs/ace')
const { castToObjectId } = require('../Helpers/ModelFormatters')
const Persona = use('Persona')
const Database = use('Database')
const User = use('App/Models/User')

class ResetPassword extends Command {
  static get signature () {
    return `
      reset:password
      {userId?: User ID}
      {--all: Indicate we want to reset all users}
    `
  }
  
  static get description () {
    return 'Reset user password'
  }
  
  async handle (args, options) {
    if (options.all) {
      const db = await Database.connect('mongodb')
      const users = await User.all()
      
      this.info('Resetting password for ' + users.rows.length + ' users')
      
      // create the password for the first user
      const firstUser = users.rows[0]
      firstUser.password = 'password'
      await firstUser.save()
      
      // use the generated password to update all other users
      const newPass = firstUser.password
      
      await db.collection('users').updateMany({}, { $set: { password: newPass } })
      
      this.success('All users password reset successfully to "password"')
      
      return
    } else {
      const user = await User.findOrFail(args.userId)
      
      // await Persona.updatePassword(user, 'password')
      user.password = 'password'
      
      await user.save()
      
      this.success('User password reset successfully to "password"')
      
      return
    }
    
    this.error('Missing a userId or --all flag')
  }
}

module.exports = ResetPassword
