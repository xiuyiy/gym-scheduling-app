(function () {

    var injectParams = ['$scope', '$rootScope', '$http', '$location'];

    var registerController = function ($scope, $rootScope, $http, $location) {

        var absUrl = $location.absUrl();

        $scope.isAdminPage = absUrl.includes('/register/admin');
        $scope.isAdminUser = false;
        $scope.adminAnswer = null;

        $scope.newUser = {
            firstName: null,
            lastName: null,
            email: null,
            password: null,
        };

        $scope.registerSuccess = false;

        $scope.backendUrl = "http://localhost:3000/";
        $scope.registerUser = function () {

            if($scope.isAdminPage&&$scope.adminAnswer&&$scope.adminAnswer.trim() === '-1/12') {
                $scope.newUser.isAdmin = true;
            }else{
                $scope.newUser.isAdmin = false;
            }
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