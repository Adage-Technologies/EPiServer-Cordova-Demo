(function () {
    "use strict";

    angular.module("myapp.services", [])
        .factory("myappService", ["$rootScope", "$http", function ($rootScope, $http) {
            var myappService = {};

            //starts and stops the application waiting indicator
            myappService.wait = function (show) {
                if (show)
                    $(".spinner").show();
                else
                    $(".spinner").hide();
            };

            return myappService;
        }])
        .factory('contentApi', contentApiFactory)
        .factory('contentService', contentServiceFactory);


    /**
     * Requests content from the EPiServer backend
     */
    contentApiFactory.$inject = ['contentServicesConfig', '$http'];
    function contentApiFactory(config, $http) {
        return {
            get: get,
        };

        /**
         * Returns a promise that resolves content for the given pageId
         */
        function get(pageId) {
            if (typeof pageId !== 'number') {
                throw new Error('Expecting a valid page id');
            }

            var deferred = Q.defer();

            $http.get(config.CONTENT_API_URL + pageId.toString())
                .then(function (response) { deferred.resolve(response.data)}),
                      deferred.reject.bind(deferred);

            return deferred.promise;
        }
    }


    /**
     * Retrieves all content.
     */
    contentServiceFactory.$inject = ['contentServicesConfig', 'contentApi'];
    function contentServiceFactory(config, contentApi) {
        return {
            get: get
        };

        /**
         * You might want to check local storage if the http request fails.
         */
        function get(pageId) {
            // TODO: handle failure, possibly look up old content in localStorage.
            return contentApi.get(pageId);
        }
    }
})();