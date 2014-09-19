;(function (W, $, _) {

   var VERSION = "0.0.1";

   var _exists = function (x) { return $(x).length >= 1; },
       _existsAll = function (xs) { return !_.isEmpty(xs) && _.every(xs, _exists); },
       nullFn = function () {};

   var defaults = {
      debug: false,
      timeout: 30000
   };

   var PR = {
      /**
       *
       * options {Object}
       *   ^^ simple options
       *   - criticalEls : List of jQuery selectors for critical elements
       *   - finishEls : List of jQuery selectors for those elements that we could call page finish load when they are appeared.
       *   - criticalFn : A function which be executed once when all critical elements has been loaded.
       *   - finishEls : List of jQuery selectors for finish elements
       *   - finishFn : A function which be executed once when all finish elements has been loaded.
       *   - debug: display debug informations. default to false.
       *
       *   ^^ advance options
       *   - criticalElsFn : A function to determine whether all critical elements has been loaded.
       *   - finishElsFn : A function  to determine whether all finish elements has been loaded.
       *
       * @public
       */
      init : function (options) {
         var that = this;
         that.opts = _.extend(defaults,
                              options || {},
                              { criticalElsFn : options.criticalElsFn || _.bind(_existsAll, {}, options.criticalEls || []),
                                criticalFn: that._wrapCompleteFn(options.criticalFn),
                                finishElsFn: options.finishElsFn || _.bind(_existsAll, {}, options.finishEls || []),
                                finishFn: that._wrapCompleteFn(options.finishFn),
                                timeoutFn: _.isFunction(options.timeoutFn) ? options.timeoutFn : nullFn
                              }
                             );

         that.timer = W.setTimeout(function () {
            that._executeTimeout();
         }, that.opts.timeout);

         that.bindAjaxComplete();

      },

      /**
       * Wrap those functions that will be execute at ajax complete in order to count functions has been executed.
       *
       * @private
       */
      _wrapCompleteFn : function (fn) {
         var that = this,
             opts = that.opts;
         if (_.isFunction(fn)) {
            return _.once(function () {
               fn();
            });
         } else {
            return nullFn;
         }
      },

      /**
       * Bind to glabal ajax complete.
       */
      bindAjaxComplete : function () {
         $(W.document).ajaxComplete(_.bind(this.ajaxCompleteFn, this));
      },

      ajaxCompleteFn : function (res, a ,xhr) {
         var opts = this.opts;
         if (opts.debug) {
            console.log("complete", new Date(), !!xhr ? xhr.url : '');
         }
         if (opts.criticalElsFn()) {
            opts.criticalFn();
         }
         // Cant say page finish if critical elements have not been loaded.
         if (opts.criticalElsFn() && opts.finishElsFn()) {
            opts.finishFn();
            W.clearTimeout(this.timer);
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
            console.log("timeout", new Date());
         }
         opts.timeoutFn();
      }


   };

   $.fn.spaPageReady = function (options) {
      var elem = this[0];
      if (elem) {
         PR.init(options);
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
