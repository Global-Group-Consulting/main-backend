/**
 * Makes the collection name from the model name
 *
 * @method makeCollectionName
 *
 * @param  {String}      modelName
 *
 * @return {String}
 */
export function makeCollectionName(modelName: string, camelCase?: boolean): string;
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
export function makeForeignKey(fieldName: string, camelCase?: boolean): string;
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
 * Makes the pivot collection by concating both the names with _ and first
 * converting them to snake case and singular form
 *
 * @method makePivotCollectionName
 *
 * @param  {String}           modelName
 * @param  {String}           relatedModelName
 *
 * @return {String}
 */
export function makePivotCollectionName(modelName: string, relatedModelName: string, camelCase?: boolean): string;
/**
 * Makes the embed name
 *
 * @method makeEmbedName
 *
 * @param  {String}           modelName
 *
 * @return {String}
 */
export function makeEmbedName(modelName: string, camelCase?: boolean): string;
/**
 * Makes the embeds name
 *
 * @method makeEmbedsName
 *
 * @param  {String}           modelName
 *
 * @return {String}
 */
export function makeEmbedsName(modelName: string, camelCase?: boolean): string;
/**
 * make meta data for paginated results.
 *
 * @method makePaginateMeta
 *
 * @param  {Number}         total
 * @param  {Number}         page
 * @param  {Number}         perPage
 * @return {Object}
 *
 * @public
 */
export function makePaginateMeta(total: number, page: number, perPage: number): Object;
