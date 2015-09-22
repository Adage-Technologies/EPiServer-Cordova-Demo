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
            // When this is first called, the pageId is not known. Assume we are on the home page.
            if (typeof pageId === 'undefined') {
                return entryPoint()
                    .then(function (response) { return response.homePageId })
                    .then(content);
            }

            return content(pageId);
        }

        /**
         * Returns a promise that resolves the page id of the home page (ie the application 'entry point')
         */
        function entryPoint() {
            var deferred = Q.defer();

            // TODO : actually get the page id from the EPiServer backend
            var pageId = config.HOME_PAGE_ID;
            deferred.resolve({ homePageId: pageId });
            return deferred.promise;
        }

        /**
         * Returns a promise that resolves content for the given pageId
         */
        function content(pageId) {
            var deferred = Q.defer();

            // TODO : actually request the content from the EPiServer backend
            var page = {
                content: {
                    whatText: "This is going to be CMS content that can be specified within an EPiServer site.",
                    whoText: "This is going to be CMS content that can be specified within an EPiServer site.",
                    whyText: "This is going to be CMS content that can be specified within an EPiServer site.",
                    contactText: "This is going to be CMS content that can be specified within an EPiServer site.",
                },
                pageId: pageId
            };

            deferred.resolve(page);
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
         * Will first attempt to retrieve the content from EPiServer. If this fails, we will check
         * localStorage. If both fail, the returned promise will be rejected.
         */
        function get(pageId) {
            return contentApi.get(pageId)
                .catch(getFromLocalStorage)
                .then(saveToLocalStorage)
                .then(function (page) { return page.content });
        }

        function getFromLocalStorage(pageId) {
            if (typeof pageId === 'undefined') {
                pageId = config.HOME_PAGE_ID;
            }

            var content = localStorage.getItem('content' + pageId.toString());

            if (content) {
                return content;
            }

            throw new Error('No content found in local storage');
        }

        function saveToLocalStorage(page) {
            // Do not store 'undefined'
            if (typeof page === 'undefined') {
                throw new Error('Attempted to save undefined.');
            }

            localStorage.setItem('content' + page.pageId.toString(), page);

            return page;
        }
    }
})();