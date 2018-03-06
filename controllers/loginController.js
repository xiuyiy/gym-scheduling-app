(function () {

    var injectParams = ['$scope', '$rootScope', '$location', '$http'];

    var loginController = function ($scope, $rootScope, $location, $http) {

        $scope.currentUser = {
            email: null,
            password: null
        };

        $scope.loginError;

        $scope.backendUrl = "http://localhost:3000/";

        $scope.login = function () {
            debugger;
            $http.post($scope.backendUrl + "login", $scope.currentUser)
                .then(function (res) {
                    debugger;
                    alert("login success!");
                }).catch(function (error) {
                $scope.loginError = error.data;
            });
        }

        $scope.goToReservationPage = function () {
            $location.path('/register');
        }
    }

    loginController.$inject = injectParams;

    angular.module('gym-schedule-app').controller('loginController', loginController);

}());