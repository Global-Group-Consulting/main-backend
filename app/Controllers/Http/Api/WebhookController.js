'use strict'

/** @typedef {import("../../../Models/User")} User */

/** @type {User} */
const UserModel = use("App/Models/User")
/** @type {import("../../../Models/SignRequest")} */
const SignRequestModel = use("App/Models/SignRequest")
/** @type {import("../../../Models/File")} */
const FileModel = use("App/Models/File")
const Event = use("Event")

const AccountStatuses = require("../../../../enums/AccountStatuses")

const {LogicalException} = require('@adonisjs/generic-exceptions')


class WebhookController {
  async _onContractSigned(incomingData, signRequest) {
    /** @type {User} */
    const user = await signRequest.user().fetch()

    if (!user) {
      throw new Error("Can't find any user")
    }

    if (user.account_status === AccountStatuses.APPROVED
      && user.contractSignedAt
      && user.contractStatus !== incomingData.event_type
      //&& process.env.NODE_ENV !== "development"
    ) {
      return
    }

    user.account_status = AccountStatuses.APPROVED
    user.incompleteData = null // reset existing incomplete data
    user.contractSignedAt = new Date(incomingData.timestamp)
    user.contractDeclinedAt = null

    user.contractStatus = incomingData.event_type

    // User model will emit event user::approved
    await user.save()

    try {
      // Store the contract file in S3
      await FileModel.store([incomingData.document.pdf], user._id, user._id, {
        clientName: incomingData.document.name,
        extname: "pdf",
        fileName: "null",
        fieldName: "contractDoc",
        type: "application",
        subtype: "pdf",
      })

      // Store the contract signature file in S3
      await FileModel.store([incomingData.document.signing_log.pdf], user._id, user._id, {
        clientName: incomingData.document.name.replace(".pdf", "[SignLog].pdf"),
        extname: "pdf",
        fileName: "null",
        fieldName: "contractDocSignLog",
        type: "application",
        subtype: "pdf",
      })
    } catch (er) {
      // if (process.env.NODE_ENV !== 'development') {
        if (er.response) {
          throw new LogicalException(er.response.statusText, er.response.status)
        } else {
          throw er
        }
      /*} else {
        console.error(er)
      }*/
    }

    Event.emit("user::approved", user)
  }

  async _onContractDeclined(incomingData, signRequest) {
    /** @type {User} */
    const user = await signRequest.user().fetch()

    if (!user) {
      throw new Error("Can't find any user")
    }

    if (user.account_status === AccountStatuses.APPROVED && user.contractSignedAt) {
      return
    }

    user.contractStatus = incomingData.event_type
    user.contractDeclinedAt = new Date(incomingData.timestamp)

    await user.save()
  }

  async onSignRequest({request, response}) {
    /** @type {import("../../../../@types/SignRequest/Webhooks.d").WebhooksCall} */
    const incomingData = request.body

    /** @type {typeof import("../../../Models/SignRequest")} */
    const signRequest = await SignRequestModel.where("uuid", incomingData.document.signrequest.uuid).first()

    if (!signRequest) {
      throw new Error("Can't find any request that matches this one.")
    }

    if (!signRequest.hooks) {
      signRequest.hooks = []
    }

    const dataToAdd = {
      ...incomingData,
      document: {
        ...incomingData.document,
        signrequest: signRequest._id // avoid adding again the sign request because i already have it
      }
    }

    // trying to handle the case where the hook is called more than once
    let replacingExistingEvent = false

    // In some cases the signer can be empty, so i handle it.
    if (incomingData.signer) {
      const existingSameEventIndex = signRequest.hooks.findIndex(_hook => _hook.event_type === incomingData.event_type
        && _hook.signer.email === incomingData.signer.email)

      // If already exists the same event, i replace it with the new one.
      if (existingSameEventIndex > -1) {
        replacingExistingEvent = true
        signRequest.hooks.splice(existingSameEventIndex, 1, dataToAdd)
      } else {
        signRequest.hooks.push(dataToAdd)
      }
    } else {
      signRequest.hooks.push(dataToAdd)
    }

    signRequest.save()

    // If the contract is signed by all the required signers, must approve the user and store the contract in S3.
    if (incomingData.event_type === "signed" && !replacingExistingEvent) {
      await this._onContractSigned(incomingData, signRequest)
    }

    if (incomingData.event_type === "declined") {
      await this._onContractDeclined(incomingData, signRequest)
    }

    return response.ok()
  }
}

module.exports = WebhookController
