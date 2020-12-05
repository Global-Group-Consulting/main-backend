const Env = use("Env")

/**
 * @type {import("../@types/SignRequest/index.d").Config}
 */
module.exports = {
  apiKey: Env.get("DOC_SIGN_KEY"),
  publicUrl: Env.get("DOC_PUBLIC_URL") + "/api/v1",
  signRequestData: {
    redirectUrl: Env.get("DOC_REDIRECT_SIGNED"),
    redirectUrlDeclined: Env.get("DOC_REDIRECT_DECLINED"),
    eventsCallbackUrl: Env.get("DOC_EVENTS_CALLBACK"),
    disable_attachments: true,
    disable_text_signatures: false,
    disable_text: true,
    disable_date: true,
    disable_emails: true,
    who: "mo",
    text_message_verification_locked: true,
    from_email: "florian.leica@hashtager.eu"/*Env.get("MAIL")*/,
    from_email_name: Env.get("MAIL_FROM"), // Must be the one from the env, used for other emails
  },
  signers: {
    me: {
      email: 'florian.leica@hashtager.eu',
      // first_name: "Hastager",
      // last_name: "Rossi",
      display_name: "Global Group Consulting"
    }
  },
  templates: {
    mainContract: {
      uuid: "53189f5a-cbbc-4b6b-82d7-acc72d909414",
      fields: [
        {"external_id": "name", "text": "${firstName} ${lastName}"},
        {"external_id": "contractNumber", "text": "${contractNumber}"}
      ]
    }
  }
}
