;(function ($, _) {

   // TODO: JSONP - Global events are never fired for cross-domain script or JSONP requests.

   /**
    * Wrap a function that would be only executed once.
    */
   var _exists = function (x) { return $(x).length >= 1; },
       _existsAll = function (xs) { return _.every(xs, _exists); },

       criticalEls = ['#div2-internal', '#div3-internal'],
       criticalElsFn = _.bind(_existsAll, {}, criticalEls),
       criticalFn = _.once(function () {
             console.warn(" ================ CRITICAL ELEMENTS DONE ===========");
       }),

       finishEls = ['#div5-internal'],
       finishElsFn = _.bind(_existsAll, {}, finishEls),
       finishFn = _.once(function () {
             console.warn(" ================ PAGE DONE ===========");
       });

   $(document)
      .ajaxComplete(function (res, a, xhr) {
         console.log("complete", new Date(), xhr.url);

         if (criticalElsFn()) {
            criticalFn();
         }
         if (finishElsFn()) {
            finishFn();
         }
      })
      //.ajaxSuccess(function (res, a, xhr) {
      //   console.log("success", new Date(), xhr.url);
      //})
   ;

})(jQuery, _);
