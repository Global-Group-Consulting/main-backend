/**
 * Makes the table name from the model name
 *
 * @method makeTableName
 *
 * @param  {String}      modelName
 *
 * @return {String}
 */
export function makeTableName(modelName: string): string;
/**
 * Makes the setter name for a given field name
 *
 * @method
 *
 * @param  {String} fieldName
 *
 * @return {String}
 */
export function getSetterName(fieldName: string): string;
/**
 * Makes the getter name for a given field name
 *
 * @method
 *
 * @param  {String} fieldName
 *
 * @return {String}
 */
export function getGetterName(fieldName: string): string;
/**
 * Makes the scope name for a given field.
 *
 * @method
 *
 * @param  {String} fieldName
 *
 * @return {String}
 */
export function makeScopeName(fieldName: string): string;
/**
 * Makes the foreignkey for the a given model name
 *
 * @method
 *
 * @param  {String} fieldName
 *
 * @return {String}
 */
export function makeForeignKey(fieldName: string): string;
/**
 * Returns the event name and cycle for a given event
 *
 * @method
 *
 * @param  {String} eventName
 *
 * @return {Array}
 */
export function getCycleAndEvent(eventName: string): any[];
/**
 * Makes the pivot table by concating both the names with _ and first
 * converting them to snake case and singular form
 *
 * @method makePivotTableName
 *
 * @param  {String}           modelName
 * @param  {String}           relatedModelName
 *
 * @return {String}
 */
export function makePivotTableName(modelName: string, relatedModelName: string): string;
/**
 * Tells whether a value exists or not, by checking for
 * null and undefined only
 *
 * @method existy
 *
 * @param  {Mixed} value
 *
 * @return {Boolean}
 */
export function existy(value: Mixed): boolean;
/**
 * Returns whether the given client supports returning
 * fields. This is added to get rid of knex warnings
 *
 * @method supportsReturning
 *
 * @param  {String}          client
 *
 * @return {Boolean}
 */
export function supportsReturning(client: string): boolean;
