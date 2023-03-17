export = View;
/**
 * View engine to be used for rendering views. It makes
 * use of Edge as the templating engine. Learn more
 * about edge [here](http://edge.adonisjs.com/)
 *
 * During HTTP request/response lifecycle, you should
 * make use of `view` instance to render views.
 *
 * @binding Adonis/Src/View
 * @singleton
 * @alias View
 * @group Http
 *
 * @class View
 * @constructor
 *
 * @example
 * ```js
 * Route.get('/', ({ view }) => {
 *   return view.render('home')
 * })
 * ```
 */
declare class View {
    constructor(Helpers: any, cacheViews?: boolean);
    engine: any;
    /**
     * Base presenter to be extended when creating
     * presenters for views.
     *
     * @attribute BasePresenter
     */
    get BasePresenter(): any;
    /**
     * Register global with the view engine.
     *
     * All parameters are directly
     * passed to http://edge.adonisjs.com/docs/globals#_adding_globals
     *
     *
     * @method global
     *
     * @param  {...Spread} params
     *
     * @return {void}
     */
    global(...params: Spread[]): void;
    /**
     * Share an object as locals with the view
     * engine.
     *
     * All parameters are directly
     * passed to http://edge.adonisjs.com/docs/data-locals#_locals
     *
     * @method share
     *
     * @param  {...Spread} params
     *
     * @return {Object}
     */
    share(...params: Spread[]): Object;
    /**
     * Render a view from the `resources/views` directory.
     *
     * All parameters are directly
     * passed to http://edge.adonisjs.com/docs/getting-started#_rendering_template_files
     *
     * @method render
     *
     * @param  {...Spread} params
     *
     * @return {String}
     */
    render(...params: Spread[]): string;
    /**
     * Renders a plain string
     *
     * All parameters are directly
     * passed to http://edge.adonisjs.com/docs/getting-started#_rendering_plain_string
     *
     * @method renderString
     *
     * @param  {...Spread}  params
     *
     * @return {String}
     */
    renderString(...params: Spread[]): string;
    /**
     * Pass presenter to the view while rendering
     *
     * @method presenter
     *
     * @param  {...Spread} params
     *
     * @return {Object}
     */
    presenter(...params: Spread[]): Object;
    /**
     * Add a new tag to the view
     *
     * @method tag
     *
     * @param  {...Spread} params params
     *
     * @return {void}
     */
    tag(...params: Spread[]): void;
}
