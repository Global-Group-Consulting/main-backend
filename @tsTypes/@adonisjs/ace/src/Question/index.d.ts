export = Question;
/**
 * Question class makes it simple to prompt user to share
 * certain information on command line. You can ask
 * simple questions to multiple choice question.
 *
 * @class Question
 * @constructor
 */
declare class Question {
    _name: string;
    _validateFn: Function | null;
    _filterFn: any;
    /**
     * Returns a standard hash of question with
     * some default values. Meant to be used
     * privately.
     *
     * @method _getQuestionsHash
     *
     * @param  {Object}          question
     * @param  {Object}          [options]
     *
     * @return {Object}
     *
     * @private
     */
    private _getQuestionsHash;
    /**
     * Normalizes the choices array of multiple input
     * questions and returns a standard array ready
     * to be parsed by inquirer
     *
     * @method _normalizeChoices
     *
     * @param  {Array}          choices
     *
     * @return {Array}
     *
     * @private
     */
    private _normalizeChoices;
    /**
     * Listen for certain events on when they occur.
     * This is not a proper implementation of event
     * emitter, but instead a nice abstraction to
     * `validate` and `filter` the user inputs.
     *
     * Right now you can listen for `validate` and
     * `filter` events only. More details are
     * shared in the docs.
     *
     * @method on
     *
     * @param  {String}   event
     * @param  {Function} callback
     *
     * @chainable
     */
    on(event: string, callback: Function): Question;
    /**
     * Prompts for an `input` type question.
     *
     * @method ask
     * @async
     *
     * @param  {String} question
     * @param  {String} [defaultValue = null]
     * @param  {Object} [options]
     *
     * @return {String|Null}
     *
     * @example
     * ```js
     * const name = await question.ask('Enter project name')
     *
     * // with default name
     * const name = await question.ask('Enter project name', 'yardstick')
     * ```
     */
    ask(question: string, defaultValue?: string | undefined, options?: Object | undefined): string | null;
    /**
     * Confirm user for an action. Choosing yes
     * will return `true` otherwise `false`.
     *
     * @method confirm
     *
     * @param  {String} question
     * @param  {Object} [options]
     *
     * @return {Boolean}
     *
     * @example
     * ```js
     * const runMigrations = await question.confirm('Do you want to migrations?')
     * ```
     */
    confirm(question: string, options?: Object | undefined): boolean;
    /**
     * Prompts for an secure type questions like
     * asking for passwords, secure keys etc.
     *
     * @method secure
     * @async
     *
     * @param  {String} question
     * @param  {String} [defaultValue = null]
     * @param  {Object} [options]
     *
     * @return {String|Null}
     *
     * @example
     * ```js
     * const ghKey = await question.secure('Enter github key')
     * ```
     */
    secure(question: string, defaultValue?: string | undefined, options?: Object | undefined): string | null;
    /**
     * Prompt with choices option. User
     * can select multiple options too.
     *
     * @method multiple
     *
     * @param  {String}  title
     * @param  {Array}   choices
     * @param  {Array}   [selected = []]
     * @param  {Object}  [options = {}]
     *
     * @return {Array}
     *
     * @example
     * ```js
     * const lunch = await question
     *   .on('validate', function (selected) {
     *     return selected.length > 2 ? 'Cannot select more than 2' : true
     *   })
     *   .multiple('Friday lunch ( 2 per person )', [
     *     'Roasted vegetable lasagna',
     *     'Vegetable & feta cheese filo pie',
     *     'Chicken meatballs with lentil, tomato',
     *     'Carrot + Tabbouleh',
     *     'Roasted Cauliflower + Aubergine'
     *   ])
     * ```
     */
    multiple(title: string, choices: any[], selected?: any[] | undefined, options?: Object | undefined): any[];
    /**
     * Prompt a message with a choices list. User
     * can only select one option at a time.
     *
     * @method choice
     *
     * @param  {String}  title
     * @param  {Array}   choices
     * @param  {String}  [defaultChoice]
     * @param  {Object}  [options = {}]
     *
     * @return {String}
     *
     * @example
     * ```js
     * const framework = await question.choice('Which framework do you use?', [
     *   {
     *     value: 'adonisjs',
     *     name: 'AdonisJs'
     *   },
     *   {
     *     value: '....',
     *     name: 'That shiny framework'
     *   }
     * ])
     * ```
     */
    choice(title: string, choices: any[], defaultChoice?: string | undefined, options?: Object | undefined): string;
    /**
     * Ask multiple option question with a shorthand
     * key to select the answers. Also `H` key can
     * be used to expand the options and choose
     * manually over shortcut key.
     *
     * @method anticipate
     *
     * @param  {String}  title
     * @param  {Array}   choices
     * @param  {String}  defaultChoice
     * @param  {Object}  [options = {}]
     *
     * @return {String}
     *
     * @example
     * ```js
     * await question.anticipate('Conflict in server.js', [
     *   {
     *     name: 'Skip and continue',
     *     key: 's',
     *     value: 'skip'
     *   },
     *   {
     *     name: 'Delete',
     *     key: 'd',
     *     value: 'delete'
     *   }
     * ])
     * ```
     */
    anticipate(title: string, choices: any[], defaultChoice: string, options?: Object | undefined): string;
}
