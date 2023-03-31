export = RuntimeException;
/**
 * Runtime exception is thrown when some unexpected behavior
 * is detected at rutime.
 *
 * @class RuntimeException
 */
declare class RuntimeException {
    static get repo(): string;
    /**
     * Missing config exception is thrown when configuration
     * is not defined for a given key
     *
     * @method missingConfig
     *
     * @param  {String}      key
     * @param  {String}      configLocation
     *
     * @return {RuntimeException}
     */
    static missingConfig(key: string, configLocation: string): RuntimeException;
    /**
     * This exception is raised when appKey is missing
     * inside the config file but required to make
     * some operation
     *
     * @method missingAppKey
     *
     * @param  {String}      provider - Name of the provider who want to use the app key
     *
     * @return {RuntimeException}
     */
    static missingAppKey(provider: string): RuntimeException;
    /**
     * This exception is raised when environment variable
     * is not defined, but is required for app operation.
     *
     * @method missingEnvKey
     *
     * @param  {String}      environment variable name (e.g. `HOME` or `PATH`)
     *
     * @return {RuntimeException}
     */
    static missingEnvKey(key: any): RuntimeException;
    /**
     * This exception is raised when configuration is not
     * complete for a given config file or key
     *
     * @method incompleteConfig
     *
     * @param  {Array}          missingKeys
     * @param  {String}         file
     * @param  {String}         forKey
     *
     * @return {RuntimeException}
     */
    static incompleteConfig(missingKeys: any[], file: string, forKey: string): RuntimeException;
    /**
     * Invoke instance of this class with a custom message
     * status and error code
     *
     * @method invoke
     *
     * @param  {String} message
     * @param  {Number} [status = 500]
     * @param  {String} [code = E_RUNTIME_ERROR]
     *
     * @return {RuntimeException}
     */
    static invoke(message: string, status?: number | undefined, code?: string | undefined): RuntimeException;
}
