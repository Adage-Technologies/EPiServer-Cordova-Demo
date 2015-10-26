(function () {
    "use strict";

    angular.module("myapp", ["ionic", "myapp.controllers", "myapp.services"])
        .run(function ($ionicPlatform) {
            $ionicPlatform.ready(function () {
                if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                }
                if (window.StatusBar) {
                    StatusBar.styleDefault();
                }
            });
        })
        .constant('contentServicesConfig', {
            CONTENT_API_URL: 'http://ascend-dev.adagetechnologies.com/api/mobilepagedata/',
            HOME_PAGE_ID: 'home'
        })
        .config(function ($stateProvider, $urlRouterProvider) {
            $stateProvider
            .state("app", {
                url: "/app",
                abstract: true,
                templateUrl: "app/templates/view-menu.html",
                controller: "appCtrl"
            })
            .state("app.home", {
                url: "/home",
                templateUrl: "app/templates/view-home.html",
                controller: "homeCtrl"
            })
            .state("app.about", {
                url: "/about",
                templateUrl: "app/templates/view-about.html",
                controller: "aboutCtrl"
            })
            .state("app.directions", {
                url: "/directions",
                templateUrl: "app/templates/view-directions.html",
                controller: "directionsCtrl"
            })
            .state("app.content", {
                url: "/content/*id",
                templateUrl: "app/templates/view-about.html",
                controller: "aboutCtrl"
            })
            .state("app.beacon", {
                url: "/beacon",
                templateUrl: "app/templates/view-beacon.html",
                controller: "beaconCtrl"
            });
            $urlRouterProvider.otherwise("/app/home");
        });
})();