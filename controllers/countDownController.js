
(function () {

    var injectParams = ['$scope', '$rootScope', '$location', '$timeout'];

    var countDownController = function ($scope, $rootScope, $location, $timeout) {
        //set count down for 3 seconds
        $scope.countDownSec = 4;
        
        $scope.countingDown = function () {
            $scope.countDownSec --;
            $scope.timeoutCountdown = $timeout($scope.countingDown,1000);
            if($scope.countDownSec === -1){
                $scope.redirectToLogin();
            }
        }

        $scope.redirectToLogin = function() {

            $timeout.cancel($scope.timeoutCountdown);
            $location.path("/login");
        };

        $scope.countingDown();
    }

    countDownController.$inject = injectParams;

    angular.module('gym-schedule-app').controller('countDownController', countDownController);

}());