/**
Created by Ming He on Feb 24, 2018
**/

(function () {

    var injectParams = ['$scope', '$rootScope'];

    var signupController = function ($scope, $rootScope) {

    }

    signupController.$inject = injectParams;

    angular.module('gym-schedule-app').controller('signupController', signupController);

}());
