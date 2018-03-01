
(function () {

    var injectParams = ['$scope', '$rootScope', '$http'];

    var registerController = function ($scope, $rootScope, $http) {
        $scope.newUser = {
            firstName: null,
            lastName: null,
            email: null,
            password: null,
            userId: null
        };

        $scope.backendUrl = "http://localhost:3000/";
        $scope.registerUser = function () {
            $http.post($scope.backendUrl + "users", $scope.newUser)
                .then(function (response) {
                    getUserId();
                }).catch(function (response) {
                alert(response.data);
            });

        }

        var getUserId = function() {
            $http.get($scope.backendUrl + "users?email="+ $scope.newUser.email)
                .then(function (response) {
                    $scope.newUser.userId = response._id;
                    sendEmailForRegisteration();
                }).catch(function (response) {
                alert(response.data);
            })

        }

        var sendEmailForRegisteration = function () {
            $http.get($scope.backendUrl + "send?to=" + $scope.newUser.email + "&id=" + $scope.newUser.userId)
                .then(function (response) {
                    alert("Please check your email to verfiy your account!");
                }).catch(function (response) {
                alert(response.data);
            })

        }


    }

    registerController.$inject = injectParams;

    angular.module('gym-schedule-app').controller('registerController', registerController);

}());