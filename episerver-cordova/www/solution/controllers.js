(function () {
    "use strict";

    angular.module("myapp.controllers", ['ngSanitize'])

    .controller("appCtrl", ["$scope", function ($scope) {
    }])

    //homeCtrl provides the logic for the home screen
    .controller("homeCtrl", ["$scope", "$state", function ($scope, $state) {
        $scope.refresh = function () {
            //refresh binding
            $scope.$broadcast("scroll.refreshComplete");
        };
    }])

    //errorCtrl managed the display of error messages bubbled up from other controllers, directives, myappService
    .controller("errorCtrl", ["$scope", "myappService", function ($scope, myappService) {
        //public properties that define the error message and if an error is present
        $scope.error = "";
        $scope.activeError = false;

        //function to dismiss an active error
        $scope.dismissError = function () {
            $scope.activeError = false;
        };

        //broadcast event to catch an error and display it in the error section
        $scope.$on("error", function (evt, val) {
            //set the error message and mark activeError to true
            $scope.error = val;
            $scope.activeError = true;

            //stop any waiting indicators (including scroll refreshes)
            myappService.wait(false);
            $scope.$broadcast("scroll.refreshComplete");

            //manually apply given the way this might bubble up async
            $scope.$apply();
        });
    }])
    .controller('aboutCtrl', aboutUsController)
    .controller('directionsCtrl', directionsController)
    .controller('beaconCtrl', beaconController);


    /**
     * Exposes our app's content for rendering.
     */
    aboutUsController.$inject = ['$scope', '$stateParams', 'contentService'];
    function aboutUsController($scope, $stateParams, contentService) {
        $scope.cms = {};
        $scope.givenId = $stateParams.id;

        var CURRENT_PAGE_ID = 164;

        if ($scope.givenId)
            CURRENT_PAGE_ID = parseInt($scope.givenId, 10);

        function refreshThisContent() {
            refreshCmsContent($scope, contentService, CURRENT_PAGE_ID)
        }

        refreshThisContent();
        $scope.refresh = refreshThisContent;
    }

    /**
     * Exposes our app's content for rendering.
     */
    directionsController.$inject = ['$scope', '$stateParams', 'contentService'];
    function directionsController($scope, $stateParams, contentService) {
        // TODO : Add in fields from the about Us Controller
    }

    function refreshCmsContent($scope, contentService, current_page_id) {
        contentService.get(current_page_id)
            .then(function (content) {
                $scope.$applyAsync(function () {
                    _.assign($scope.cms, content);
                    console.log($scope);
                });
            })
            .fail(function (error) {
                $scope.$applyAsync(function () {
                    console.log(error);
                    $scope.error = error;
                });
            });
    }


    beaconController.$inject = ['$scope', 'contentService', 'myappService'];
    function beaconController($scope, contentService, spinner) {
        $scope.beaconInfo = {};
        $scope.monitorInfo = [];

        var isSearching = false;
        $scope.searchBeaconsChange = function () {
            isSearching = !isSearching;
            if (isSearching) {
                $scope.startMonitoring();
            } else {
                $scope.stopMonitoring();
            }
        };

        $scope.startMonitoring = function () {
            var delegate = new cordova.plugins.locationManager.Delegate();

            delegate.didDetermineStateForRegion = function (pluginResult) {

                cordova.plugins.locationManager.appendToDeviceLog('[DOM] didDetermineStateForRegion: '
                    + JSON.stringify(pluginResult));
            };

            delegate.didStartMonitoringForRegion = function (pluginResult) {
                console.log('didStartMonitoringForRegion:', pluginResult);
            };

            delegate.didRangeBeaconsInRegion = function (pluginResult) {
                $scope.updateVisibleBeacons(pluginResult);
            };

            cordova.plugins.locationManager.setDelegate(delegate);
            cordova.plugins.locationManager.requestWhenInUseAuthorization();
            cordova.plugins.locationManager.startRangingBeaconsInRegion(window.beaconRegion)
                .fail(console.error)
                .done();

            alert('monitoring started');
        }

        $scope.updateVisibleBeacons = function (recentBeaconData) {
            var currentBeacons = recentBeaconData.beacons;

            $scope.$applyAsync(function () {

                if ($scope.monitorInfo.length > 10) {
                    $scope.monitorInfo.splice(1, 1);
                }

                $scope.monitorInfo.push({ beaconTime: new Date(), beaconsFound: currentBeacons.length });

                $scope.beaconsFound = currentBeacons;
            });
        }

        $scope.stopMonitoring = function () {

            cordova.plugins.locationManager.stopRangingBeaconsInRegion(window.beaconRegion)
                .fail(console.error)
                .done();

            alert('monitoring stopped');
        }

        var uuid = 'B9407F30-F5F8-466E-AFF9-25556B57FE6D';
        var identifier = 'nearbyBeacons';
        
        if (typeof cordova != "undefined" && typeof cordova.plugins != "undefined" && typeof cordova.plugins.locationManager != "undefined" && !window.beaconRegion) {
            window.beaconRegion = new cordova.plugins.locationManager.BeaconRegion(identifier, uuid);
        }

    }
})();