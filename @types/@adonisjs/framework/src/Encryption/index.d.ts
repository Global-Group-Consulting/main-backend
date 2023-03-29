export = Encryption;
/**
 * This class is used to encrypt/decrypt values using a secure
 * key and also base64 `encode` and `decode` strings.
 *
 * @binding Adonis/Src/Encryption
 * @alias Encryption
 * @group Core
 * @singleton
 *
 * @class Encryption
 * @constructor
 */
declare class Encryption {
    constructor(appKey: any, options: any);
    appKey: any;
    encryptor: any;
    /**
     * Returns a new instance of encrypter with different options
     *
     * @method getInstance
     *
     * @param  {Object}    options
     *
     * @return {Encryption}
     */
    getInstance(options: Object): Encryption;
    /**
     * Encrypt a string, number or an object
     *
     * @method encrypt
     *
     * @param  {Mixed} input
     *
     * @return {String}
     *
     * @example
     * ```js
     * Encryption.encrypt('hello world')
     * Encryption.encrypt({ name: 'virk' })
     * ```
     */
    encrypt(input: Mixed): string;
    /**
     * Decrypt encoded string
     *
     * @method decrypt
     *
     * @param  {String} cipherText
     *
     * @return {Mixed}
     *
     * @example
     * ```js
     * Encryption.decrypt(encryptedValue)
     * ```
     */
    decrypt(cipherText: string): Mixed;
    /**
     * Base64 encode a string
     *
     * @method base64Encode
     *
     * @param  {String}     input
     *
     * @return {String}
     *
     * @example
     * ```js
     * Encryption.base64Encode('hello world')
     * ```
     */
    base64Encode(input: string): string;
    /**
     * Decode a previously encoded base64 string or buffer
     *
     * @method base64Decode
     *
     * @param  {String|Buffer}     encodedText
     *
     * @return {String}
     *
     * @example
     * ```js
     * Encryption.base64Decode(encodedValue)
     * ```
     */
    base64Decode(encodedText: string | Buffer): string;
}
