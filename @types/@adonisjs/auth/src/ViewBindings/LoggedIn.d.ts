declare function _exports(BaseTag: any): {
    new (): {
        [x: string]: any;
        /**
         * The tag name
         *
         * @method tagName
         *
         * @return {String}
         */
        readonly tagName: string;
        /**
         * Tag is not a block tag
         *
         * @method isBlock
         *
         * @return {Boolean}
         */
        readonly isBlock: boolean;
        /**
         * Compile method to create a if block to compile
         * content when a user is logged in
         *
         * @method compile
         *
         * @param  {Object} compiler
         * @param  {Object} lexer
         * @param  {Object} buffer
         * @param  {String} options.body
         * @param  {Array} options.childs
         * @param  {Number} options.lineno
         *
         * @return {void}
         */
        compile(compiler: Object, lexer: Object, buffer: Object, { body, childs, lineno }: string): void;
        /**
         * Nothing needs to be done at runtime
         *
         * @method run
         */
        run(): void;
    };
    [x: string]: any;
};
export = _exports;
