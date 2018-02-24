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
            for (var i = 0; i < $socpe.totalNumber; i++) {
                $scope.reservations[i] = {
                    "name": null,
                    "employeeId": null
                };
            }
        };

        $scope.reserveASpot = function(name, employeeId, number) {
            if ($scope.reservations.some(function(element){
                return (element.employeeId === employeeId);
            })) {
                $scope.reserveSuc = false;
                $scope.reserveMessage = "Sorry you've already reserved.";
            } else {
                $scope.reservations[number] = {
                    "name": name,
                    "employeeId": employeeId
                }
                $scope.reserveSuc = true;
                $scope.reserveMessage = "Your just reserved successfully!";
            }
        };

        $scope.formatDate = function (date) {
            var d = new Date(date),
                month = '0' + (d.getMonth() + 1),
                day = '0' + d.getDate(),
                year = d.getFullYear();

            month = month.slice(month.length - 2);
            day = day.slice(day.length - 2);

            return [year, month, day].join('-');
        }

    };

    reserveController.$inject = injectParams;

    angular.module('gym-schedule-app').controller('reserveController', reserveController);

}());
