const SettingModel = use("App/Models/Setting")
const Logger = use("Logger")
const Helpers = use("Helpers")

const {get} = require("lodash")

class Settings {
  constructor(config) {
    this.config = config

    this.globalSettings = {}
  
    if (Helpers.isAceCommand()) {
      return
    }

    this.logInfo("Called constructor of SETTINGS PROVIDER")

    this._initSettings()
      .then()
  }

  async _initSettings() {
    const settings = await SettingModel.readAll();

    this.logInfo("INITIALIZING SETTINGS PROVIDER")

    this.storeSettings(settings)
  }

  logInfo(message, ...attrs) {
    Logger.info("[SettingsProvider] " + message, ...attrs)
  }

  logError(message, ...attrs) {
    Logger.error("[SettingsProvider] " + message, ...attrs)
  }

  storeSettings(data) {
    this.globalSettings = Object.values(data).reduce((acc, curr) => {
      acc[curr.name] = curr

      return acc
    }, {})

    this.logInfo("Stored new Settings")
  }

  get(path) {
    const setting = get(this.globalSettings, path)

    return setting ? setting.value : null
  }
}

module.exports = Settings
