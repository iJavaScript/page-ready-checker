;(function ($, _) {

   //
   // TODO: JSONP - Global events are never fired for cross-domain script or JSONP requests.
   //

   var VERSION = "0.0.1";

   var _exists = function (x) { return $(x).length >= 1; },
       _existsAll = function (xs) { return !_.isEmpty(xs) && _.every(xs, _exists); },
       nullFn = function () {};

   var defaults = {
      debug: false
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
         this.opts = _.extend(defaults,
                              options || {},
                              { criticalElsFn : options.criticalElsFn || _.bind(_existsAll, {}, options.criticalEls || []),
                                criticalFn: _.isFunction(options.criticalFn) ? _.once(options.criticalFn) : nullFn,
                                finishElsFn: options.finishElsFn || _.bind(_existsAll, {}, options.finishEls || []),
                                finishFn: _.isFunction(options.finishFn) ? _.once(options.finishFn) : nullFn
                              }
                             );
         this.bindAjaxComplete();
      },

      bindAjaxComplete : function () {
         var that = this,
             opts = that.opts;
         $(document)
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
      criticalEls : ['#div2-internal', '#div3-internal'],
      finishEls : ['#div5-internal'],
      criticalFn : function () {
         console.warn(" ================ CRITICAL ELEMENTS DONE ===========");
      },
      finishFn : function () {
         console.warn(" ================ PAGE DONE ===========");
      }
   });

})(jQuery, _);
