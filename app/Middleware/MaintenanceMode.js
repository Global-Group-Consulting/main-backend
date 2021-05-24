'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */

/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const SettingsProvider = use("SettingsProvider");

const UserRoles = require("../../enums/UserRoles")
const moment = require("moment")

class MaintenanceMode {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({request, auth, response}, next) {
    const callMethod = request.method().toLowerCase();
    const url = request.url();

    const whitelistMethods = ["get"]
    const whitelistPaths = ["/api/auth/login", "/api/auth/refresh", "/api/auth/logout"]
    const userAdmin = [UserRoles.ADMIN].includes(auth.user.role)

    // If the url is a whitelisted one, continue the request
    if (whitelistPaths.includes(url) || whitelistMethods.includes(callMethod)) {
      return next()
    }

    // Maintenance mode message
    if (SettingsProvider.get("maintenanceMode")) {
      const changingMaintenanceMode = Object.values(request.body).find(el => el.name === "maintenanceMode")

      if (userAdmin && url === "/api/settings" && !changingMaintenanceMode.value) {
        return next()
      }

      throw new Error("L'applicazione è momentaneamente in manutenzione, pertanto è possibile accedere all'applicazione in sola lettura.")
    }

    /*
    must check if the settings allow the current operation based on the time and date
     */
    const nowDate = moment()

    const criticalDays = [15, nowDate.clone().endOf('month')];
    const isCriticalDay = criticalDays.includes(nowDate.date());
    const timeIntervalBasic = SettingsProvider.get("requestsBlockTime");
    const timeIntervalCritical = SettingsProvider.get("requestsBlockTimeCriticDays");

    let timeInterval = isCriticalDay ? timeIntervalCritical : timeIntervalBasic;

    // If user is admin
    if (userAdmin) {
      // And if is not a critical day, don't block it.
      if (!isCriticalDay) {
        return next()
      }

      // If is a critical day and the user is admin set the interval
      timeInterval = ["05:00", "22:00"]
    }

    // If no setting exists, allow user.
    if (!timeInterval) {
      return next()
    }

    const startTime = moment(timeInterval[0], "HH:mm")
    const endTime = moment(timeInterval[1], "HH:mm")

    if (nowDate.isBefore(startTime) || nowDate.isAfter(endTime)) {
      throw new Error("Non è possibile eseguire questa operazione fuori dalla fascia oraria " + timeInterval.join(" - "))
    }

    // call next to advance the request
    await next()
  }
}

module.exports = MaintenanceMode
