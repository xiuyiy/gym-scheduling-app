
(function () {

    var injectParams = ['$scope', '$rootScope'];

    var loginController = function ($scope, $rootScope) {
        console.log("everything is great.");
    }

    loginController.$inject = injectParams;

    angular.module('gym-schedule-app').controller('loginController', loginController);

}());