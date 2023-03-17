export = VanillaSerializer;
/**
 * The vanilla serailizer is the bare bones serializer
 * shipped with Lucid and is set as the default
 * serializer.
 *
 * @class VanillaSerializer
 * @constructor
 */
declare class VanillaSerializer<T> {
    constructor(rows: any, pages?: null, isOne?: boolean);
    /**
     * The serializer rows. All rows should be instance
     * of Lucid model
     *
     * @attribute rows
     *
     * @type {Array}
     */
    rows: T[];
    /**
     * The pagination meta data
     *
     * @attribute pages
     *
     * @type {Object}
     */
    pages: Object;
    /**
     * A boolean indicating whether return output of
     * toJSON should be an array of an object.
     *
     * @attribute isOne
     *
     * @type {Boolean}
     */
    isOne: boolean;
    /**
     * Attaches the eagerloaded relationship to the return
     * payload.
     *
     * @method _attachRelations
     *
     * @param  {Model}         modelInstance
     * @param  {Object}         output
     *
     * @return {void}
     *
     * @private
     */
    private _attachRelations;
    /**
     * Attaches sideloaded data to the `__meta__` key on the
     * output object
     *
     * @method _attachMeta
     *
     * @param  {Model}    modelInstance
     * @param  {Object}    output
     *
     * @return {void}
     *
     * @private
     */
    private _attachMeta;
    /**
     * Returns the json object for a given model instance
     *
     * @method _getRowJSON
     *
     * @param  {Model}    modelInstance
     *
     * @return {Object}
     *
     * @private
     */
    private _getRowJSON;
    /**
     * Add row to the list of rows. Make sure the row
     * is an instance of the same model as the other
     * model instances.
     *
     * @method addRow
     *
     * @param  {Model} row
     */
    addRow(row: Model): void;
    /**
     * Get first model instance
     *
     * @method first
     *
     * @return {Model}
     */
    first(): Model;
    /**
     * Returns the row for the given index
     *
     * @method nth
     *
     * @param  {Number} index
     *
     * @return {Model|Null}
     */
    nth(index: number): Model | null;
    /**
     * Get last model instance
     *
     * @method last
     *
     * @return {Model}
     */
    last(): Model;
    /**
     * Returns the size of rows
     *
     * @method size
     *
     * @return {Number}
     */
    size(): number;
    /**
     * Convert all rows/model instances to their JSON
     * representation
     *
     * @method toJSON
     *
     * @return {Array|Object}
     */
    toJSON(): any[] | Object;
}
