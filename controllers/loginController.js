(function () {

    var injectParams = ['$scope', '$rootScope', '$location', '$http', '$window'];

    var loginController = function ($scope, $rootScope, $location, $http, $window) {

        $scope.currentUser = {
            email: null,
            password: null
        };

        $scope.loginError;

        $scope.backendUrl = "http://localhost:3000/";

        $scope.login = function () {
            $http.post($scope.backendUrl + "login", $scope.currentUser)
                .then(function (res) {
                    $window.localStorage.setItem("authInfo",JSON.stringify(res.data));
                    // var backend = JSON.parse($window.localStorage.getItem("authInfo"));
                    $scope.getToClassPage();
                    }).catch(function (error) {
                $scope.loginError = error.data;
            });
        }

        $scope.goToRegisterPage = function () {
            $location.path('/register');
        }

        $scope.getToClassPage = function () {
            $location.path('/class');
        }
    }

    loginController.$inject = injectParams;

    angular.module('gym-schedule-app').controller('loginController', loginController);

}());