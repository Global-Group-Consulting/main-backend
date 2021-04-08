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
    who: "o",
    text_message_verification_locked: true,
    from_email: Env.get("MAIL"),
    from_email_name: Env.get("MAIL_FROM"), // Must be the one from the env, used for other emails
  },
  signers: {
    /*me: {
      email: 'florian.leica@hashtager.eu',
      // first_name: "Hastager",
      // last_name: "Rossi",
      display_name: "Global Group Consulting"
    }*/
  },
  templates: {
    mainContract: {
      uuid: Env.get("DOC_MODEL_UUID"),
      fields: [
        {
          "text": "${fiscalCode}",
          "external_id": "fiscalCode"
        },
        {
          "text": "${legalRepresentativeAddress}",
          "external_id": "legalRepresentativeAddress"
        },
        {
          "text": "${legalRepresentativeCountry}",
          "external_id": "legalRepresentativeCountry"
        },

        {
          "text": "${legalRepresentativeCF}",
          "external_id": "legalRepresentativeCF"
        },
        {
          "text": "${birthProvince}",
          "external_id": "birthProvince"
        },
        {
          "text": "${fullName}",
          "external_id": "fullName"
        },
        {
          "text": "${contractPercentage}",
          "external_id": "perc"
        },
        {
          "text": "${businessName}",
          "external_id": "businessName"
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
          "text": "${businessCity}",
          "external_id": "businessCity"
        },
        {
          "text": "${businessAddress}",
          "external_id": "businessAddress"
        },
        {
          "text": "${legalRepresentativeFullName}",
          "external_id": "legalRepresentativeFullName"
        },
        {
          "text": "${residenceProvince}",
          "external_id": "residenceProvince"
        },
        {
          "text": "${residenceCity}",
          "external_id": "residenceCity"
        },
        {
          "text": "${residenceZip}",
          "external_id": "residenceZip"
        },
        {
          "text": "${legalRepresentativeProvince}",
          "external_id": "legalRepresentativeProvince"
        },
        {
          "text": "${legalRepresentativeBirthCity}",
          "external_id": "legalRepresentativeBirthCity"
        },
        {
          "text": "${legalRepresentativeBirthProvince}",
          "external_id": "legalRepresentativeBirthProvince"
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
          "text": "${birthCity}",
          "external_id": "birthCity"
        },

        {
          "text": "${legalRepresentativeBirthDate}",
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
