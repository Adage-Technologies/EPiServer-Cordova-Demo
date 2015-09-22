// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function (angular, Q, _) {
    "use strict";

    /**
     * Application constants
     */
    var CONTENT_API_URL = '';
    var HOME_PAGE_ID = 'home';


    /**
     * Angular application declaration
     */
    angular.module('HelloWorldApp', [])
        .factory('contentService', contentServiceFactory)
        .factory('contentApi', contentApiFactory)
        .controller('helloWorldController', helloWorldController);


    

    /**
     * Exposes our app's content for rendering.
     */
    helloWorldController.$inject = ['$scope', 'contentService', 'myAppService'];
    function helloWorldController($scope, contentService, spinner) {
        var _this = this;
        _this.page = {};

        spinner.wait();

        // Attempt to retrieve the home page's content
        contentService.get()

            // Merge page properties with the controller
            .then(function (content) {
                $scope.$applyAsync(function () {
                    _.assign(_this.page, content);
                });
            })

            // Handle an error (i.e. from being offline and not having cached content)
            .fail(function (error) {
                $scope.$applyAsync(function () {
                    console.log(error);
                    _this.error = error;
                });
            });
    }

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
        
        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
} )(angular, Q, _);