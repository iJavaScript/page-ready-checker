;(function (W, $, _) {

    var VERSION = "0.0.1";

    var _exists = function (x) { return $(x).length >= 1; },
        _existsAll = function (xs) { return !_.isEmpty(xs) && _.every(xs, _exists); },
        nullFn = function () {};

    var defaults = {
        debug: false,
        timeout: 30000,
        ajaxStopTimeout: 2000
    };

    var PR = {
        /**
         *
         * options {Object}
         *   ^^ simple options
         *   - criticalEls : List of jQuery selectors for critical elements; OR a function to determine whether critical elements have been loaded.
         *   - critacalFn : A function will be executed once when all critical elements has been loaded.
         *   - pageReadyEls:
         *   - pageReadyFn : A function which be executed once when no further ajax call.
         *   - timeoutFn: A function will be executed after timeout when page is not ready.
         *   - debug: display debug informations. default to false.
         *
         * @public
         */
        init : function (options) {
            var that = this;
            that.opts = _.extend(defaults,
                                 options || {},
                                 { criticalEls : this._wrapElsToFunc(options.criticalEls),
                                   criticalFn: this._onceFnDefault(options.criticalFn),
                                   pageReadyEls: this._wrapElsToFunc(options.pageReadyEls),
                                   pageReadyFn: this._onceFnDefault(options.pageReadyFn),
                                   timeoutFn: this._onceFnDefault(options.timeoutFn)
                                 }
                                );


            // A timer will be executed if failed to be page ready.
            that._timeout = W.setTimeout(function () {
                that._executeTimeout();
            }, that.opts.timeout);

            that._bindGlobalAjaxEvents();

        },

        /**
         * @arguments critcilaEls {Array | Function} Could be list of jquery selectors that indicate critical elements
         *                                           or a function that determine whether critical elements have been lodaed.
         * @private
         */
        _wrapElsToFunc : function () {
            var ag1 = arguments[0];
            if (_.isArray(ag1) && ! _.isEmpty(ag1)) {
                return _.bind(_existsAll, {}, ag1);
            } else if (_.isFunction(ag1)) {
                return ag1;
            } else {
                return nullFn;
            }
        },

        /**
         * Wrap those functions that will be execute at ajax complete in order to count functions has been executed.
         *
         * @private
         */
        _onceFnDefault : function (fn) {
            var that = this,
                opts = that.opts;
            if (_.isFunction(fn)) {
                return _.once(fn);
            } else {
                return nullFn;
            }
        },

        /**
         * Bind to glabal ajax complete.
         */
        _bindGlobalAjaxEvents : function () {
            $(W.document).ajaxComplete(_.bind(this.ajaxCompleteFn, this))
                .ajaxStop(_.bind(this._ajaxStopFn, this));
        },

        _pageReadyFunc: function () {
            var that = this,
                opts = that.opts;

            if (opts.debug) {
                console.debug(" >>>>>>>>>>> Page Ready Executed at ajax stop <<<<<<<<<<<<<< ");
            }
            opts.pageReadyFn();
            W.clearTimeout(that._timeout);
        },

        _ajaxStopFn: function () {
            var that = this,
                opts = this.opts;

            if (opts.debug) {
                console.debug(" >>>>>>>>>>> ajax stop <<<<<<<<<<<<<< ", arguments);
            }

            if (that._ajaxStopTimer) {
                W.clearTimeout(that._ajaxStopTimer);
            }

            if (_.isFunction(opts.pageReadyEls) && opts.pageReadyEls !== nullFn) {
                // Use user provided function/elements to check whether page ready.
                if (opts.pageReadyEls()) {
                    that._pageReadyFunc();
                }
            } else {
                // Run page ready function after certain time of no AJAJ requests.
                that._ajaxStopTimer = W.setTimeout(_.bind(that._pageReadyFunc, that), opts.ajaxStopTimeout);

            }
        },

        ajaxCompleteFn : function (res, a ,xhr) {
            var opts = this.opts;
            if (opts.debug) {
                console.debug("complete", new Date(), !!xhr ? xhr.url : '');
            }
            if (opts.criticalEls()) {
                opts.criticalFn();
            }
        },

        /**
         * If criticalFn or finishFn not got executed at timeout, some erros colud happen.
         * Therefore, execute the timout function. This function won't be executed unless there are errors.
         *
         * @see #ajaxComplete how this timer be clear.
         */
        _executeTimeout : function () {
            var opts = this.opts;
            if (opts.debug) {
                console.debug("timeout", new Date());
            }
            opts.timeoutFn();
        }


    };

    // Be a requireJS module
    if (typeof define !== "undefined") {
        define([], function () {
            return PR;
        });
    }

    // Publish to windows
    W.PR = PR;

})(window, jQuery, _);
