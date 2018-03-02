
(function () {

    var injectParams = ['$scope', '$rootScope', '$http'];

    var registerController = function ($scope, $rootScope, $http) {
        $scope.newUser = {
            firstName: null,
            lastName: null,
            email: null,
            password: null,
        };

        $scope.backendUrl = "http://localhost:3000/";
        $scope.registerUser = function () {
            console.log($scope.newUser);
            $http.post($scope.backendUrl + "users", $scope.newUser)
                .then(function (response) {
                    alert("user created!");
                }).catch(function (response) {
                alert(response.data);
            });

        }

    }

    registerController.$inject = injectParams;

    angular.module('gym-schedule-app').controller('registerController', registerController);

}());