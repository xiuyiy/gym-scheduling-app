/**
Created by Ming He on Feb 24, 2018
**/

(function () {

    var injectParams = ['$scope', '$rootScope', '$http', '$window'];

    var reserveController = function ($scope, $rootScope, $http, $window) {
        //var currentDate = new Date();
        //var className = "Barbell";
        // $scope.reservationUrl = "http://mac-mhe2.corp.microstrategy.com:3000/reservations";
        console.log("yes!! we are good here");
        $scope.reservationUrl = "http://localhost:3000/reservations";


        $scope.authInfo = JSON.parse($window.localStorage.getItem("authInfo"));

        // $httpProvide.defaults.headers.common = {'token': $scope.authInfo.token};


        $scope.generateReservations = function() {
            var date = $scope.formatDate();
            console.log(date);
            $http.get($scope.reservationUrl + "?date=" + date,{
                headers: {'X-AuthToken': $scope.authInfo.token}
            })
                .then(function(response){
                    $scope.oriReservations = response.data;
                    $scope.renderReservations();
                }).catch(function(response){
                    alert("Error!");
                })
        };
        $scope.renderReservations = function() {
            $scope.totalNumber = 20;
            $scope.reservations = [];//0-19
            for (var i = 1; i <= $scope.totalNumber; i++) {
                var res = $scope.oriReservations.filter(function(element){
                    return (element.spotId == i);
                });
                if (res.length > 0) {
                    $scope.reservations[i-1] = res[0];
                } else {
                    $scope.reservations[i-1] = {};
                }
            }
        };

        $scope.submitReservation = function(name, employeeId) {
            if ($scope.reservations.some(function(element){
                return (element.userId === employeeId);
            })) {
                $scope.reserveSuc = false;
                $scope.reserveMessage = "Sorry you've already reserved.";
                alert($scope.reserveMessage);
            } else {
                $scope.reserveSuc = true;
                $scope.reserveMessage = "Your just reserved successfully!";
                var body = {
                    name: name,
                    employeeId: employeeId,
                    spotId: $scope.selectedSeat,
                    date: $scope.formatDate()
                }
                console.log(body);
                $http.post($scope.reservationUrl, body)
                    .then(function(response){
                        $scope.reservations[$scope.selectedSeat-1] = body;
                        $scope.selectedSeat = null;
                        alert($scope.reserveMessage);
                    }).catch(function(response){
                        alert(response.data);
                    });
            }
        };

        $scope.formatDate = function (date) {
            if (!date) {
                var d = new Date(),
                    month = '0' + (d.getMonth() + 1),
                    day = '0' + d.getDate(),
                    year = d.getFullYear();
            } else {
                var d = new Date(date),
                    month = '0' + (d.getMonth() + 1),
                    day = '0' + d.getDate(),
                    year = d.getFullYear();
            }
            month = month.slice(month.length - 2);
            day = day.slice(day.length - 2);

            return [year, month, day].join('-');
        };

        //index ranging from 0-19
        $scope.selectSeat = function (index) {
            if (!$scope.reservations[index].name) {

                //selectedSeat ranging from 1-20
                $scope.selectedSeat = index+1;
            } else {
                //alert("The seat is already occupied!");
            }
        };

        $scope.generateReservations();
    };

    reserveController.$inject = injectParams;

    angular.module('gym-schedule-app').controller('reserveController', reserveController);

}());
