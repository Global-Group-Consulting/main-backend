'use strict'

const Queue = use('LaravelQueueProvider')
const Env = use('Env')
const Auth = exports = module.exports = {}
const NotificationPlatformType = require('../../enums/NotificationPlatformType')
const NotificationType = require('../../enums/NotificationType')

Auth.onPasswordForgot = async ({ user, token, app }) => {
  await Queue.dispatchCreateNotification({
    title: 'Recupero password account',
    content: 'Clicca sul link per recuperare la password',
    type: NotificationType.PASSWORD_FORGOT,
    platforms: [NotificationPlatformType.EMAIL],
    action: {
      text: 'Recupera password',
      link: `${Env.get('PUBLIC_URL')}/auth/recover?t=${token}`
    },
    receivers: [{
      '_id': user._id,
      'firstName': user.firstName,
      'lastName': user.lastName,
      'email': user.email
    }]
  }, {
    token
  })
}

Auth.onPasswordRecovered = async ({user, app}) => {
  await Queue.dispatchCreateNotification({
    title: 'Password cambiata correttamente',
    content: 'Clicca sul link per accedere al tuo account',
    type: NotificationType.PASSWORD_RECOVER,
    platforms: [NotificationPlatformType.EMAIL],
    action: {
      text: 'Accedi',
      link: `${Env.get('PUBLIC_URL')}/login`
    },
    receivers: [{
      '_id': user._id,
      'firstName': user.firstName,
      'lastName': user.lastName,
      'email': user.email
    }]
  }, {
    publicEmail: Env.get('PUBLIC_EMAIL')
  })
}
