'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

const SettingTypes = require("../../enums/SettingTypes")
const {castToObjectId, castToBoolean} = require("../Helpers/ModelFormatters")

/*
Settings da includere
- Blocco operazioni per fascia oraria
  - TODO:// fare due campi, uno per gli utenti normali ed uno per l'amministrazione


 */

/*
campi da usare
- name
- value
- type - app or user account
- userId - in caso la settings sia legata all'account di un utente
 */
class Setting extends Model {
  /**
   * @param {string} [userId]
   * @returns {Promise<Collection>}
   */
  static async readAll(userId) {
    if (userId) {
      return this.where({"userId": castToObjectId(userId), "type": SettingTypes.USER}).fetch()
    }

    const data = await this.where("type", SettingTypes.GLOBAL).fetch();

    return data.toJSON().reduce((acc, curr) => {
      acc[curr.name] = curr

      return acc
    }, {})
  }

  /**
   *
   * @param {{name: string, userId?: string, type: string}} data
   * @returns {Promise<Model>}
   */
  static async upsert(data) {
    const query = {
      name: data.name,
      type: SettingTypes.GLOBAL
    }

    data.type = SettingTypes.GLOBAL

    if (data.userId) {
      query.userId = castToObjectId(data.userId)
      query.type = SettingTypes.USER

      data.type = SettingTypes.USER
    }

    let existingSetting = await this.where(query).first()

    if (!existingSetting) {
      existingSetting = new Setting()
    }

    existingSetting.merge(data);
    await existingSetting.save()

    return existingSetting
  }

  setMaintenanceMode(mode) {
    return castToBoolean(mode)
  }
}

module.exports = Setting
