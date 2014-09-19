;(function (W, $, _) {

   //
   // TODO: JSONP - Global events are never fired for cross-domain script or JSONP requests.
   //

   var VERSION = "0.0.1";

   var _exists = function (x) { return $(x).length >= 1; },
       _existsAll = function (xs) { return !_.isEmpty(xs) && _.every(xs, _exists); },
       nullFn = function () {};

   var defaults = {
      debug: false,
      timeout: 10000
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

         // Only 2 callback handlers will be executed, criticalFn and finishFn.
         // Update this number accordingly when support more.
         that.handlers = 2;
         // how many handlers have been executed.
         that.exeCount = 0;

         that.bindAjaxComplete();

         W.setTimeout(function () {
            that.executeTimeout();
         }, that.opts.timeout);
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
               that.exeCount++;
            });
         } else {
            return nullFn;
         }
      },

      bindAjaxComplete : function () {
         var that = this,
             opts = that.opts;
         $(W.document)
            .ajaxComplete(function (res, a, xhr) {

               if (opts.debug) {
                  console.log("complete", new Date(), xhr.url);
               }
               if (opts.criticalElsFn()) {
                  opts.criticalFn();
               }
               if (opts.finishElsFn()) {
                  opts.finishFn();
               }
            });
      },

      /**
       * If criticalFn or finishFn not got executed at timeout, some erros colud happen.
       * Therefore, execute the timout function.
       */
      executeTimeout : function () {
         var opts = this.opts;
         if (this.exeCount !== this.handlers) {
            if (this.opts.debug) {
               console.log("===== Timeout ====");
            }
            this.opts.timeoutFn();
         }
      }


   };

   $.fn.spaPageReady = function (options) {
      var elem = this[0];
      if (elem) {
         PR.init(options);
      }
   };

   if (typeof define !== "undefined") {
      define([], function () {
         return PR;
      });
   }

   $('body').spaPageReady({
      debug: true,
      timeout: 8000,
      criticalEls: ['#div2-internal', '#div3-internal'],
      finishEls: ['#div5-internal'],
      //finishElsFn: function () { return false; },

      criticalFn: function () {
         console.warn(" ================ CRITICAL ELEMENTS DONE ===========");
      },
      finishFn: function () {
         console.warn(" ================ PAGE DONE ===========");
      },
      timeoutFn: function () {
         console.warn(" ================ PAGE Timout ===========");
      }
   });

})(window, jQuery, _);
