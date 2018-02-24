/**
Created by Ming He on Feb 24, 2018
**/

(function () {

    var injectParams = ['$scope', '$rootScope'];

    var ReserveController = function ($scope, $rootScope) {
        console.log("everything is great.");
    }

    ReserveController.$inject = injectParams;

    angular.module('gym-schedule-app').controller('ReserveController', ReserveController);

}());
