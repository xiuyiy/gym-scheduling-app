/**
Created by Ming He on Feb 24, 2018
**/

(function () {

    var injectParams = ['$scope', '$rootScope', '$http'];

    var reserveController = function ($scope, $rootScope, $http) {
        var currentDate = new Date();
        var className = "Barbell";

        $scope.totalNumber = 20;

        $scope.generateReservations = function() {
            $scope.reservations = [];
            for (var i = 0; i < $scope.totalNumber; i++) {
                $scope.reservations[i] = {
                    "name": null,
                    "employeeId": null
                };
            }
        };

        $scope.submitReservation = function(name, employeeId) {
            if ($scope.reservations.some(function(element){
                return (element.employeeId === employeeId);
            })) {
                $scope.reserveSuc = false;
                $scope.reserveMessage = "Sorry you've already reserved.";
            } else {
                $scope.reservations[$scope.selectedSeat] = {
                    "name": name,
                    "employeeId": employeeId
                };
                $scope.reserveSuc = true;
                $scope.reserveMessage = "Your just reserved successfully!";
                $scope.selectedSeat = null;
            }
            alert($scope.reserveMessage);
        };

        $scope.formatDate = function (date) {
            var d = new Date(date),
                month = '0' + (d.getMonth() + 1),
                day = '0' + d.getDate(),
                year = d.getFullYear();

            month = month.slice(month.length - 2);
            day = day.slice(day.length - 2);

            return [year, month, day].join('-');
        };

        $scope.selectSeat = function (index) {
            if (!$scope.reservations[index-1].name) {
                $scope.selectedSeat = index - 1;
            } 
        };

        $scope.generateReservations();
    };

    reserveController.$inject = injectParams;

    angular.module('gym-schedule-app').controller('reserveController', reserveController);

}());
