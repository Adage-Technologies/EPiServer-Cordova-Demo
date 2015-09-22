(function () {
    "use strict";

    angular.module("myapp.controllers", [])

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
    .controller('aboutCtrl', aboutUsController);


    /**
     * Exposes our app's content for rendering.
     */
    aboutUsController.$inject = ['$scope', 'contentService', 'myappService'];
    function aboutUsController($scope, contentService, spinner) {
        $scope.page = {};

        // Attempt to retrieve the home page's content
        contentService.get()

            // Merge page properties with the controller
            .then(function (content) {
                $scope.$applyAsync(function () {
                    _.assign($scope.page, content);
                });
            })

            // Handle an error (i.e. from being offline and not having cached content)
            .fail(function (error) {
                $scope.$applyAsync(function () {
                    console.log(error);
                    $scope.error = error;
                });
            });
    }
})();