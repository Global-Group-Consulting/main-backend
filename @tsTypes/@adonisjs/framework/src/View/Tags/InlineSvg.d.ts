declare function _exports(BaseTag: any): {
    new (publicPath: any): {
        [x: string]: any;
        _publicPath: any;
        /**
         * Returns absolute path to the file
         *
         * @method _getAbsPath
         *
         * @param  {String}    filePath
         *
         * @return {String}
         *
         * @private
         */
        _getAbsPath(filePath: string): string;
        /**
         * Normalize the file path by prefixing svg to
         * it when it's missing
         *
         * @method _normalizePath
         *
         * @param  {String}       filePath
         *
         * @return {String}
         *
         * @private
         */
        _normalizePath(filePath: string): string;
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
         * List of allowed expressions
         *
         * @method allowedExpressions
         *
         * @return {Array}
         */
        readonly allowedExpressions: any[];
        /**
         * Compile method to fetch and set svg as part of
         * html
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
