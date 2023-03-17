export = GlobalScopes;
declare class GlobalScopes {
    scopes: any[];
    /**
     * Add a new scope to the scopes lists.
     *
     * @param {Function} callback
     * @param {String}   [name]
     *
     * @chainable
     */
    add(callback: Function, name?: string | undefined): GlobalScopes;
    /**
     * Returns a new itterator to apply runtime filters and execute scope callbacks
     *
     * @returns {ScopeIterator}
     */
    iterator(): ScopeIterator;
}
/**
 * Scope iterator to execute all the global scopes. Also this class allows filtering scopes at runtime for a single query
 *
 * @class ScopeIterator
 *
 * @param {Array} scopes
 */
declare class ScopeIterator {
    constructor(scopes: any);
    _scopes: any;
    _ignoreList: any[];
    /**
     * Ignore an array of scopes or ignore all the scopes for a given query
     *
     * @param {Array} scopes Array of scope names to ignore
     *
     * @chainable
     */
    ignore(scopes: any[]): ScopeIterator;
    /**
     * Execute all the scopes of the iterator, ignore scopes will not be executed
     *
     * @param {Object} builder Query builder reference
     *
     * @return void
     */
    execute(builder: Object): void;
}
