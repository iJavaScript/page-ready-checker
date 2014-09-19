;(function () {

   function _getUrl (name, timeout) {
      return '/shape/api?name=' + name + '&time=' + timeout;
   }

   function _onloadHandler () {
      $.get(_getUrl('name1', 100))
         .done(function (res) {

            $('#div1').html('<p id="div1-internal">' + res.name + '</p>');
            $.get(_getUrl('name2', 800))
               .done(function (res2) {
                  $('#div2').html('<p id="div2-internal">' + res2.name + '</p>');
               });

         });

      $.get(_getUrl('name4', 1000))
         .done(function (res) {
            $('#div4').html('<p id="div4-internal">' + res.name + '</p>');
         });

      $.get(_getUrl('name3', 200))
         .done(function (res) {

            $('#div3').html('<p id="div3-internal">' + res.name + '</p>');

            $.get(_getUrl('name5', 1200))
               .done(function (res2) {
                  $('#div5').html('<p id="div5-internal">' + res2.name + '</p>');
               });

         });
   }

   _onloadHandler();

})();
