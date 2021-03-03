const Env = use("Env")

/**
 * @type {import("../@types/SignRequest/index.d").Config}
 */
module.exports = {
  apiKey: Env.get("DOC_SIGN_KEY"),
  publicUrl: Env.get("DOC_PUBLIC_URL") + "/api/v1",
  signRequestData: {
    redirect_url: Env.get("DOC_REDIRECT_SIGNED"),
    redirect_url_declined: Env.get("DOC_REDIRECT_DECLINED"),
    events_callback_url: Env.get("DOC_EVENTS_CALLBACK"),
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
      uuid: "dfa39b96-7fca-406f-99b6-eafe56372a83",
      fields: [
        {
          "text": "${fiscalCode}",
          "external_id": "fiscalCode"
        },
        {
          "text": "${legalRepresentativeAddress}",
          "external_id": "residenceAddress"
        },
        {
          "text": "${legalRepresentativeCountry}",
          "external_id": "residenceCountry"
        },
        {
          "text": "${businessCity}",
          "external_id": "businessCity"
        },
        {
          "text": "${businessAddress}",
          "external_id": "businessAddress"
        },
        {
          "text": "}",
          "external_id": "legalRepresentativeCF"
        },
        {
          "text": "${birthProvince}",
          "external_id": "birthProvince"
        },
        {
          "text": "${firstName} ${lastName}",
          "external_id": "fullName"
        },
        {
          "text": "${businessName}",
          "external_id": "businessName"
        },
        {
          "text": "${firstName} ${lastName}",
          "external_id": "legalRepresentativeFullName"
        },
        {
          "text": "${businessProvince}",
          "external_id": "residenceProvince"
        },
        {
          "text": "${legalRepresentativeProvince}",
          "external_id": "legalRepresentativeProvince"
        },
        {
          "text": "${vatNumber}",
          "external_id": "vatNumber"
        },
        {
          "text": "${birthDate}",
          "external_id": "birthDate"
        },
        {
          "text": "${contractNumber}",
          "external_id": "contractNumber"
        },
        {
          "text": "${birthCountry}",
          "external_id": "birthCountry"
        },
        {
          "text": "${businessProvince}",
          "external_id": "businessProvince"
        },
        {
          "text": "${businessRegion}",
          "external_id": "businessRegion"
        },
        {
          "text": "",
          "external_id": "legalRepresentativeBirthDate"
        },
        {
          "text": "${contractInitialInvestment}",
          "external_id": "contractInitialInvestment"
        },
        {
          "text": "${contractInitialInvestmentGoldVal}",
          "external_id": "contractInitialInvestmentGoldVal"
        },
        {
          "text": "${contractInitialInvestmentText}",
          "external_id": "contractInitialInvestmentText"
        },
        {
          "text": "${contractInitialInvestmentGold}",
          "external_id": "contractInitialInvestmentGold"
        },
        {
          "text": "${contractPaymentMethod}",
          "external_id": "contractPaymentMethod"
        },
        {
          "text": "${contractInitialInvestmentGoldValText}",
          "external_id": "contractInitialInvestmentGoldValText"
        },
        {
          "text": "${contractInitialInvestmentGoldText}",
          "external_id": "contractInitialInvestmentGoldText"
        },
        {
          "text": "${contractDate}",
          "external_id": "contractDate"
        },
        {
          "text": "${email}",
          "external_id": "email"
        },
        {
          "text": "${mobile}",
          "external_id": "mobile"
        },
        {
          "text": "${residenceAddress}",
          "external_id": "residenceAddress"
        }
      ]
    }
  }
}
