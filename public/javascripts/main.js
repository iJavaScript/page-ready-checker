;(function (PR) {

   // ================================================================================
   // Init page ready checker
   // ================================================================================

    try {
        PR.init({
            debug: true,
            timeout: 15000,

            criticalEls: ['#div2-internal', '#div3-internal', '#jsonp-internal'],
            //criticalElsFn: function () { return false; },

            criticalFn: function () {
                console.warn(" ================ CRITICAL ELEMENTS DONE ===========");
            },

            pageReadyFn: function () {
                console.warn(" ================ PAGE DONE ===========");
            },

            timeoutFn: function () {
                console.warn(" ================ PAGE Timout ===========");
            }
        });

    } catch(error) {
        console.error(error);
    }

   $.ajax({url: 'http://publicfeed.stubhub.com/listingCatalog/select/?version=2.2&q=urlpath:(dallas-cowboys-tickets%20dallas-cowboys-arlington-at-t-stadium-10-5-2014-9037680)%20AND%20active:1%20AND%20allowedViewingDomain:[*%20TO%20*]&fq=&start=0&rows=10&fl=id%20description%20timezone%20event_date_time_local%20channelId%20artistPrimaryStyle%20ancestorGenreIds%20ancestorGeoIds%20ancestorDescriptions%20ancestorGenreDescriptions%20city%20state%20venue_name%20urlpath%20genreUrlPath%20venue_config_id%20geography_parent%20is_scrubbing_enabled%20view_from_section_ind%20book_of_business_id%20image_url%20channel%20bundled_type%20venue_config_name%20lat_lon%20minPrice%20currency_code%20hide_event_date%20hide_event_time%20venue_configuration_version%20venue_config_map_type%20totalPostings%20genre_parent_name%20pageType%20venue_config_ga_ind%20totalTickets%20name_primary_en_US%20seo_description_en_US%20keywords_en_US%20seo_title_en_US%20id%20description%20leaf%20pageType%20urlpath%20sportsTeam%20channelId%20artistPrimaryStyle%20ancestorGenreIds%20ancestorGeoIds%20ancestorDescriptions%20ancestorGenreDescriptions%20gameType%20genre_parent_name%20canHaveEventsFlag%20genre_description_en_US%20seo_description_en_US%20keywords_en_US%20seo_title_en_US%20%20stubhubDocumentType&wt=json&json.wrf=?',

           dataType: "jsonp",
           success : function (res) {
              $('#div-jsonp').html('<p id="jsonp-internal">' + res.response.numFound + '</p>');
           },

           complete : function (res, a) {
              // jQuery 2.x handles globle ajaxComplete for JSONP case.
              if ($.fn.jquery.indexOf('2.') !== 0) {
                 PR.ajaxCompleteFn(res, a, {url: this.url});
              }
           }

          }) ;


   // ================================================================================
   // Loading elements for page
   // ================================================================================

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

       $.ajax({url: _getUrl('nameError', 100), beforeSend: function () { return false; }})
           .done(function (res) {
               if (!!res) {
                   $('body').append('<p style="clear:both; color:red;">' + JSON.stringify(res)  + '</p>');
               }
           });

   }

   _onloadHandler();

})(window.PR);
