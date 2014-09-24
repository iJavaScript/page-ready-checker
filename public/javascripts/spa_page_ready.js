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
       *   - criticalEls : List of jQuery selectors for critical elements; OR a function to determine whether critical elements have been loaded.
       *   - critacalFn : A function will be executed once when all critical elements has been loaded.
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
                              { criticalEls : this._wrapCriticalEls(options.criticalEls),
                                criticalFn: this._onceFnDefault(options.criticalFn),
                                pageReadyFn: this._onceFnDefault(options.pageReadyFn),
                                timeoutFn: this._onceFnDefault(options.timeoutFn)
                              }
                             );

         that.timer = W.setTimeout(function () {
            that._executeTimeout();
         }, that.opts.timeout);

         that.bindGlobalAjaxEvents();

      },

       /**
        * @arguments critcilaEls {Array | Function} Could be list of jquery selectors that indicate critical elements
        *                                           or a function that determine whether critical elements have been lodaed.
        * @private
        */
       _wrapCriticalEls : function () {
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
      bindGlobalAjaxEvents : function () {
          $(W.document).ajaxComplete(_.bind(this.ajaxCompleteFn, this))
              .ajaxStop(_.bind(this.ajaxStopFn, this));
      },

       ajaxStopFn: function () {
           var opts = this.opts;

           if (opts.debug) {
               console.log(" >>>>>>>>>>> ajax stop <<<<<<<<<<<<<< ", arguments);
           }

           opts.pageReadyFn();
           W.clearTimeout(this.timer);
       },

      ajaxCompleteFn : function (res, a ,xhr) {
         var opts = this.opts;
         if (opts.debug) {
            console.log("complete", new Date(), !!xhr ? xhr.url : '');
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
            console.log("timeout", new Date());
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
