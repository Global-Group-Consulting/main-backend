declare const _exports: Parser;
export = _exports;
/**
 * The parser class is used to parse the user
 * signature into tokens of arguments and
 * options.
 *
 * @class Parser
 * @static
 */
declare class Parser {
    _argumentsRegex: RegExp;
    _defaultValueRegex: RegExp;
    /**
     * Extracts description from the field signature and
     * also returns a new copy of field without signature.
     *
     * So `age:Enter your age` will return ['age', 'Enter your age']
     *
     * @method _extractDescription
     *
     * @param  {String}            field
     *
     * @return {Array}
     *
     * @private
     */
    private _extractDescription;
    /**
     * Extracts the default value from the field and
     * returns a new copy of field by removing
     * default value from it.
     *
     * So `name=virk` will return ['name', 'virk']
     *
     * @method _extractDefaultValue
     *
     * @param  {String}             field
     *
     * @return {Array}
     *
     * @private
     */
    private _extractDefaultValue;
    /**
     * Find whether field is optional or not. If field
     * is optional, it returns a new string by removing
     * the `?` from it.
     *
     * In brief `name?` will return [name, true]
     *
     * @method _extractOptional
     *
     * @param  {String}         field
     *
     * @return {Array}
     *
     * @private
     */
    private _extractOptional;
    /**
     * Parses a field by performing a series of transformations
     * and extracting the useful information from it.
     *
     * @method _parseField
     *
     * @param  {String}    field
     *
     * @return {Object}
     *
     * @private
     */
    private _parseField;
    /**
     * Parses the signature into an object of tokens with
     * arguments and flags. Options starting with `-`
     * will be considered as flags.
     *
     * @method parseSignature
     *
     * @param  {String}       signature
     *
     * @return {Object}
     *
     * @example
     * ```js
     * parseSignature('{name} {--isAdmin?}')
     * // returns
     * {
     *   args: [
     *     {
     *       name: 'name',
     *       optional: false,
     *       description: '',
     *       defaultValue: null
     *     }
     *   ],
     *   flags: [
     *     {
     *       name: '--isAdmin',
     *       optional: true,
     *       description: '',
     *       defaultValue: null
     *     }
     *   ]
     * }
     * ```
     */
    parseSignature(signature: string): Object;
}
