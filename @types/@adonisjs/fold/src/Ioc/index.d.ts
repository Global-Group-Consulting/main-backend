export = Ioc;
/**
 * Ioc container instance is used to register and fetch dependencies without
 * dealing with system paths. Also dependencies can be dependent upon each
 * other transparently, instead of consumer writing all the wiring code.
 * It has support for autoloading directories, defining aliases and
 * binding fakes. Check official documentation for that.
 *
 * ### Important Note
 * A single instance of this class needs to be used by the entire application.
 * The export method of the module makes sure to return the instantiated class,
 * so that you won't have to manage singleton instances and start using it
 * as `Ioc.bind`, `Ioc.make` etc directly.
 *
 * @class Ioc
 */
declare class Ioc {
    /**
     * Store list of bindings with their closures
     *
     * @attribute _bindings
     * @private
     * @type {Object}
     */
    private _bindings;
    /**
     * Stores the list of aliases and namespaces
     * as key/value pair
     *
     * @attribute _aliases
     * @private
     * @type {Object}
     */
    private _aliases;
    /**
     * Stores list of autoloaded directories and
     * their namespaces as key/value pair
     *
     * @attribute _autoloads
     * @private
     * @type {Object}
     */
    private _autoloads;
    /**
     * Stores list of managers for the bindings to
     * be extended.
     *
     * @attribute _managers
     * @private
     * @type {Object}
     */
    private _managers;
    /**
     * Stores list of runtime fakes
     *
     * @attribute _fakes
     * @private
     * @type {Map}
     */
    private _fakes;
    /**
     * Reference to all extend calls. Extend calls
     * are executed right after all providers
     * have been booted
     *
     * @type {Object}
     */
    _extendCalls: Object;
    /**
     * Returns the namespace of an autoloaded directory when
     * subset of the namespace to be resolved matches. This function
     * matches the start of the string.
     *
     * ```
     * // Registered namespace: App
     * // Namespace to be resolved: App/Controllers/UsersController
     * 'App/Controllers/UsersController'.startsWith('App')
     * ```
     *
     * @method _getAutoloadedNamespace
     * @private
     *
     * @param  {String} namespace
     * @return {String}
     */
    private _getAutoloadedNamespace;
    /**
     * Returns whether a namespace has been registered
     * as a binding inside the IoC container or not.
     *
     * @method _isBinding
     * @private
     *
     * @param {String} name
     * @return {Boolean}
     */
    private _isBinding;
    /**
     * Returns whether the given namespace is registered as an alias
     * or not. It is does check whether the aliased namespace has
     * been registered to the IoC container or not.
     *
     * @method _isAlias
     * @private
     *
     * @param  {String}  namespace
     * @return {Boolean}
     */
    private _isAlias;
    /**
     * Returns a boolean indicating whether the namespace to
     * be resolved belongs to a autoloaded directory.
     *
     * @method _isAutoloadedPath
     * @private
     *
     * @param  {String}  namespace
     * @return {Boolean}
     */
    private _isAutoloadedPath;
    /**
     * Returns whether a given namespace has a manager
     * or not. Managers simply required to allow a
     * provider to be extended via Ioc container.
     *
     * @method _hasManager
     * @private
     *
     * @param  {String}  namespace
     * @return {Boolean}
     */
    private _hasManager;
    /**
     * Returns whether a fake for the given namespace
     * exists or not.
     *
     * @method _hasFake
     * @private
     *
     * @param  {String}  namespace
     * @return {Boolean}
     */
    private _hasFake;
    /**
     * Resolves a fake for a namespace when fake
     * is registered.
     *
     * @method _resolveFake
     * @private
     *
     * @param  {String} namespace
     * @return {Mixed}
     */
    private _resolveFake;
    /**
     * Resolves binding from the bindings map and returns the
     * evaluated value after calling the binding closure.
     *
     * It is important to call _isBinding before calling this
     * method to avoid exceptions being thrown.
     *
     * @method _resolveBinding
     * @private
     *
     * @param {String} namespace
     * @return {Mixed}
     */
    private _resolveBinding;
    /**
     * Returns path of an autoloaded namespace
     *
     * @method _getAutoloadedPath
     *
     * @param  {String}           namespace
     *
     * @return {String}
     *
     * @private
     */
    private _getAutoloadedPath;
    /**
     * Requires a file by resolving the autoloaded namespace. It
     * is important to call _isAutoloadedPath before calling
     * this method, to avoid exceptions been thrown.
     *
     * @method _resolveAutoloadedPath
     * @private
     *
     * @param  {String} namespace
     * @return {Mixed}
     */
    private _resolveAutoloadedPath;
    /**
     * Returns instance of an object if it is a valid
     * ES6 class. Also injects the dependencies
     * defined under static inject method.
     *
     * If `Item` is not a class, it will return the
     * input back as output.
     *
     * @method _makeInstanceOf
     * @private
     *
     * @param  {Mixed} Item
     * @return {Mixed}
     *
     * @example
     * ```
     * class Foo {
     *   static get inject () {
     *     return ['App/Bar']
     *   }
     *
     *   constructor (Bar) {
     *     this.Bar = Bar
     *   }
     * }
     *
     * Ioc._makeInstanceOf(Foo)
     * ```
     */
    private _makeInstanceOf;
    /**
     * Requires a file just like node.js native require.
     *
     * @private
     * @method _require
     *
     * @param {String} namespace
     * @return {Mixed}
     *
     * @throws Error when unable to load the module
     */
    private _require;
    /**
     * Returns a cloned copy of registered bindings.
     *
     * @method getBindings
     *
     * @return {Object}
     */
    getBindings(): Object;
    /**
     * Returns a cloned copy of registered aliases.
     *
     * @method getBindings
     *
     * @return {Object}
     */
    getAliases(): Object;
    /**
     * Returns a cloned copy of registered autoloaded
     * directories and their namespaces.
     *
     * @method getAutoloads
     *
     * @return {Object}
     */
    getAutoloads(): Object;
    /**
     * Returns a cloned copy of managers.
     *
     * @method getManagers
     *
     * @return {Object}
     */
    getManagers(): Object;
    /**
     * Returns a map of fakes
     *
     * @method getFakes
     *
     * @return {Map}
     */
    getFakes(): Map<any, any>;
    /**
     * Registers an alias for a namespace. It is okay
     * if that namespace does not exists when alias
     * is defined.
     *
     * @method alias
     *
     * @param  {String} namespace
     * @param  {String} alias
     *
     * @example
     * ```
     * Ioc.alias('Adonis/Src/View', 'View')
     * ```
     */
    alias(namespace: string, alias: string): void;
    /**
     * Autoloads a given directory within the given namespace.
     * Value of `pathTo` must be an absolute path, Also this
     * method does not check if the path exists or not.
     *
     * @method autoload
     *
     * @param  {String} pathTo
     * @param  {String} namespace
     *
     * @example
     * ```
     * Ioc.autoload(path.join(__dirname, './app'), 'App')
     * ```
     */
    autoload(pathTo: string, namespace: string): void;
    /**
     * Binds a namespace to the Ioc container as a binding. Given
     * closure is a factory method, called everytime the binding
     * is resolved and return value of closure will be returned
     * back.
     *
     * @method bind
     *
     * @param {String} namespace
     * @param {Function} closure
     * @throws InvalidArgumentException if closure is not a function
     *
     * @example
     * ```
     * Ioc.bind('App/Foo', (app) => {
     *   const Config = app.use('Adonis/Src/Config')
     *
     *   class Foo {
     *     constructor (Config) {
     *     }
     *   }
     *
     *   return new Foo(Config)
     * })
     * ```
     */
    bind(namespace: string, closure: Function): void;
    /**
     * Similar to bind except it will bind the namespace as
     * a singleton and will call the closure only once.
     *
     * @method singleton
     *
     * @param {String} namespace
     * @param {Function} closure
     * @throws InvalidArgumentException if closure is not a function
     *
     * @example
     * ```
     * Ioc.singleton('App/Foo', (app) => {
     *   const Config = app.use('Adonis/Src/Config')
     *
     *   class Foo {
     *     constructor (Config) {
     *     }
     *   }
     *
     *   return new Foo(Config)
     * })
     * ```
     */
    singleton(namespace: string, closure: Function): void;
    /**
     * Registers a manager for a binding. Managers are registered
     * to tell Ioc container that binding can be extended by the
     * outside world using `Ioc.extend` method.
     *
     * It is okay to register the manager before registering the
     * actual binding.
     *
     * @method manager
     *
     * @param  {String} namespace
     * @param  {Mixed} bindingInterface
     * @throws {InvalidArgumentException} If bindingInterface does not have extend method.
     *
     * @example
     * ```
     * class Foo {
     *   static extend (driver, implmentation) {
     *     this.drivers[driver] = implementation
     *   }
     * }
     *
     * // Inside provider
     * this.manager('App/Foo', Foo)
     * ```
     *
     * @example
     * ```
     * Ioc.extend('App/Foo', 'my-driver', function (app) {
     *   const Config = app.use('Adonis/Src/Config')
     *   return new MyDriverClass(Config)
     * })
     * ```
     */
    manager(namespace: string, bindingInterface: Mixed): void;
    /**
     * Extends a binding by the calling the extend method
     * on the registered manager.
     *
     * @method extend
     *
     * @param  {String}    namespace
     * @param  {String}    key
     * @param  {Function}  closure
     * @param  {...Spread} [options]
     *
     * @throws {InvalidArgumentException} If binding is not supposed to be extended
     * @throws {InvalidArgumentException} If closure is not a function
     *
     * @example
     * ```
     * Ioc.extend('Adonis/Src/Session', 'mongo', () => {
     *   return new MongoDriver()
     * })
     * ```
     */
    extend(...args: any[]): void;
    /**
     * Executes all extend calls in sequence. Successfully
     * executed extend calls will be removed from the
     * array, so that they are not executed again.
     *
     * @method executeExtendCalls
     *
     * @return {void}
     */
    executeExtendCalls(): void;
    /**
     * Registers a fake for a namespace, quite helpful
     * when writing tests.
     *
     * @method fake
     *
     * @param  {String} namespace
     * @param  {Function} closure
     *
     * @throws {InvalidArgumentException} If closure is not a function
     *
     * @example
     * ```
     * Ioc.fake('Adonis/Src/Lucid', function () {
     *   return FakeModel
     * })
     *
     * // Restore after testing
     * Ioc.restore('Adonis/Src/Lucid')
     * ```
     */
    fake(namespace: string, closure: Function): void;
    /**
     * Registers a single fake for a namespace, quite helpful
     * when writing tests.
     *
     * @method singletonFake
     *
     * @param  {String} namespace
     * @param  {Function} closure
     *
     * @throws {InvalidArgumentException} If closure is not a function
     *
     * @example
     * ```
     * Ioc.singletonFake('Adonis/Src/Lucid', function () {
     *   return new FakeModel()
     * })
     *
     * // Restore after testing
     * Ioc.restore('Adonis/Src/Lucid')
     * ```
     */
    singletonFake(namespace: string, closure: Function): void;
    /**
     * Restores fake(s).
     *
     * @method restore
     *
     * @param  {...Spread|Array} namespaces
     *
     * @example
     * ```
     * Ioc.restore('Adonis/Src/Lucid')
     * Ioc.restore('Adonis/Src/Lucid', 'Adonis/Src/Config')
     * Ioc.restore() // restore all
     * ```
     */
    restore(...namespaces: (Spread | any[])[]): void;
    /**
     * Attempts to resolve a namespace in following order.
     *
     * 1. Look for a registered fake.
     * 2. Look for a registered binding.
     * 3. Look for an alias, if found: Repeat step 1 with alias namespace.
     * 4. Look for an autoload module path.
     * 5. Fallback to native require method.
     *
     * @method use
     *
     * @param {String} namespace
     * @return {Mixed} resolved value
     *
     * @example
     * ```
     *  Ioc.use('View') // via alias
     *  Ioc.use('Adonis/Src/View') // via complete namespace
     *  Ioc.use('App/Http/Controllers/UsersController') // autoloaded namespace
     *  Ioc.use('lodash') // node module
     * ```
     */
    use(namespace: string): Mixed;
    /**
     * Attempts to resolve given namespaces and forward
     * them to the given callback.
     *
     * @method with
     *
     * @param  {string|string[]}  namespaces
     * @param  {Function}         next
     * @return {void}
     */
    with(namespaces: string | string[], next: Function): void;
    /**
     * Works as same as the `use` method, but instead returns
     * an instance of the class when resolved value is a
     * ES6 class and not a registered binding. Bindings
     * registered via `Ioc.bind` are themselves
     * supposed to return the final value.
     *
     * Also you can pass a class object by reference to return
     * a automatically resolved instance.
     *
     * @method make
     *
     * @param  {String} namespace
     * @return {Mixed}
     *
     * @example
     * ```
     * class Foo {
     *   static get inject () {
     *     return ['App/Bar']
     *   }
     *
     *   constructor (bar) {
     *     this.bar = bar
     *   }
     * }
     *
     * const fooInstance = Ioc.make(Foo)
     * ```
     */
    make(namespace: string): Mixed;
    /**
     * Returns absolute path to a namespace
     *
     * @method getPath
     *
     * @param  {String} namespace
     *
     * @return {String}
     *
     * @throws {Exception} If namespace is not part of autoloaded directories.
     */
    getPath(namespace: string): string;
    /**
     * Same as `make` but instead returns the instance of the object
     * with the check that a method exists on the resolved object.
     * If that method does not exists it will throw an exception.
     *
     * It is helpful for scanerios like Route controller binding.
     *
     * @method makeFunc
     *
     * @param  {String} pattern
     * @return {Object}
     *
     * @throws {InvalidArgumentException} If pattern is not a string with dot notation.
     * @throws {RuntimeException} If method on the given namespace is missing.
     *
     * @example
     * ```
     * Ioc.makeFunc('App/Http/Controllers/UsersController.index')
     * // returns
     * { instance: UsersControllerInstance, method: index }
     * // usage
     * instance[method].apply(instance, [...args])
     * ```
     */
    makeFunc(pattern: string): Object;
}
