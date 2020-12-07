'use strict'

/** @type {import("../../providers/Queue")} */
const Queue = use("QueueProvider")
const Env = use("Env")

const Auth = exports = module.exports = {}

Auth.onPasswordForgot = async ({user, token}) => {
  await Queue.add("send_email", {
    tmpl: "password_forgot",
    data: {
      ...user.toJSON(),
      token,
      formLink: `${Env.get('PUBLIC_URL')}/auth/recover?t=${token}`
    }
  })
}

Auth.onPasswordRecovered = async ({user}) => {
  await Queue.add("send_email", {
    tmpl: "password_recovered",
    data: user.toJSON()
  })
}
