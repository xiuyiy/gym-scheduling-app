(function () {

    var injectParams = ['$scope', '$rootScope', '$http', '$location'];

    var registerController = function ($scope, $rootScope, $http, $location) {
        console.log("good!!");
        $scope.newUser = {
            firstName: null,
            lastName: null,
            email: null,
            password: null,
        };

        $scope.registerSuccess = false;

        // $scope.backendUrl = "http://localhost:3000/";
        $scope.backendUrl = "http://env-89392-elb-2129585381.us-east-1.elb.amazonaws.com:3000/";
        $scope.registerUser = function () {
            $http.post($scope.backendUrl + "users", $scope.newUser)
                .then(function (response) {
                    if(response.status === 200) {
                        $scope.registerSuccess = true;
                    }
                }).catch(function (response) {
                alert(response.data);
            });

        }

        $scope.goToLoginPage = function () {
            $location.path('/login');
        };

    }

    registerController.$inject = injectParams;

    angular.module('gym-schedule-app').controller('registerController', registerController);

}());