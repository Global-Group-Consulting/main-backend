declare const _exports: RelationParser;
export = _exports;
/**
 * This class parses the relationship string to an
 * object.
 *
 * @class RelationParser
 * @static
 */
declare class RelationParser {
    /**
     * Returns the relationships object
     *
     * @method _normalizeRelations
     *
     * @param {Object|String[]}             relations
     *
     * @return {Object}
     */
    _normalizeRelations(relations: Object | string[]): Object;
    /**
     * Parses an object of relationship strings into
     * a new object
     *
     * @method parseRelations
     *
     * @param  {Object|String[]}       relations
     *
     * @return {Object}
     */
    parseRelations(relations: Object | string[]): Object;
    /**
     * Parse a single relationship string
     *
     * @method parseRelation
     *
     * @param  {String}      relation
     * @param  {Function}    callback
     *
     * @return {Object}
     */
    parseRelation(relation: string, callback?: Function): Object;
    /**
     * Validates the model instance to make sure the relationship
     * exists.
     *
     * @method validateRelationExistence
     *
     * @param  {Object}                   modelInstance
     * @param  {String}                   relation
     *
     * @return {void}
     */
    validateRelationExistence(modelInstance: Object, relation: string): void;
    /**
     * Returns the relationship instance by calling the relationship
     * method on the model instance.
     *
     * @method getRelatedInstance
     *
     * @param  {Object}            modelInstance
     * @param  {String}            relation
     *
     * @return {void}
     */
    getRelatedInstance(modelInstance: Object, relation: string): void;
}
