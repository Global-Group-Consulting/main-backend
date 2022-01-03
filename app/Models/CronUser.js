'use strict';

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class CronUser extends Model {
  static get createdAtColumn () {
    return 'createdAt';
  }

  static get updatedAtColumn () {
    return 'updatedAt';
  }

  static get hidden () {
    return ["password"];
  }

  static async boot () {
    super.boot();

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeCreate', async (userInstance) => {
      userInstance.password = await Hash.make(userInstance.password);
    });
  }
}

module.exports = CronUser;
