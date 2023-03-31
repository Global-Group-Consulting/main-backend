declare const _exports: Factory;
export = _exports;
/**
 * Factory class is used to define blueprints
 * and then get model or database factory
 * instances to seed the database.
 *
 * @binding Adonis/Src/Factory
 * @singleton
 * @alias Factory
 * @group Database
 *
 * @class Factory
 * @constructor
 */
declare class Factory {
    _blueprints: any[];
    /**
     * Register a new blueprint with model or table name
     * and callback to be called to return the fake data
     * for model instance of table insert query.
     *
     * @method blueprint
     *
     * @param  {String}   name
     * @param  {Function} callback
     *
     * @chainable
     *
     * @example
     * ```js
     * Factory.blueprint('App/Model/User', (fake) => {
     *   return {
     *     username: fake.username(),
     *     password: async () => {
     *       return await Hash.make('secret')
     *     }
     *   }
     * })
     * ```
     */
    blueprint(name: string, callback: Function): Factory;
    /**
     * Returns the blueprint map with the map
     * and the callback.
     *
     * @method getBlueprint
     *
     * @param  {String}     name
     *
     * @return {Object}
     */
    getBlueprint(name: string): Object;
    /**
     * Get model factory for a registered blueprint.
     *
     * @method model
     *
     * @param  {String} name
     *
     * @return {ModelFactory}
     */
    model(name: string): ModelFactory;
    /**
     * Get database factory instance for a registered blueprint
     *
     * @method get
     *
     * @param  {String} name
     *
     * @return {DatabaseFactory}
     */
    get(name: string): DatabaseFactory;
    /**
     * Clear all the registered blueprints.
     *
     * @method clear
     *
     * @return {void}
     */
    clear(): void;
}
import ModelFactory = require("./ModelFactory");
import DatabaseFactory = require("./DatabaseFactory");
