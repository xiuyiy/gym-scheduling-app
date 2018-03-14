/**
Created by Ming He on Feb 24, 2018
**/

(function () {

    var injectParams = ['$scope', '$rootScope', '$http', '$window', '$location'];

    var reserveController = function ($scope, $rootScope, $http, $window, $location) {
        //var currentDate = new Date();
        //var className = "Barbell";
        // $scope.reservationUrl = "http://mac-mhe2.corp.microstrategy.com:3000/reservations";
        $scope.reservationUrl = "http://localhost:3000/reservations";


        $scope.authInfo = JSON.parse($window.localStorage.getItem("authInfo"));

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

        $scope.today = $scope.formatDate();



        // $httpProvide.defaults.headers.common = {'token': $scope.authInfo.token};

        $scope.getCurrentUserReservations = function () {

            $scope.myReservation = {
                className: "Barbell Strength",
                classTime: $scope.today,
                enrolled: false, //default to false
                instructor: "Iuliia"
            }

            $http.get($scope.reservationUrl + "?date=" + $scope.today + "&userId=" + $scope.authInfo.userId, {
                headers: {'X-AuthToken': $scope.authInfo.token}
            })
                .then(function (response) {
                    if (response.data.length > 0) {
                        $scope.myReservation.spotId = response.data[0].spotId;
                        $scope.myReservation.enrolled = true;
                    }
                }).catch(function (error) {
                if (error.status === 403) {
                    $location.path('/login');
                }
            });
        }

        $scope.getCurrentUserReservations();


        $scope.generateReservations = function () {
            $http.get($scope.reservationUrl + "?date=" + $scope.today, {
                headers: {'X-AuthToken': $scope.authInfo.token}
            })
                .then(function (response) {
                    $scope.oriReservations = response.data;
                    $scope.renderReservations();
                    debugger;
                }).catch(function (error) {
                if (error.status === 403) {
                    $location.path('/login');
                }
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

        $scope.cancelReservation = function () {
            debugger;
            $http({
                method: 'DELETE',
                url: $scope.reservationUrl + "?date=" + $scope.today + "&userId=" + $scope.authInfo.userId,
                headers: {
                    'X-AuthToken': $scope.authInfo.token
                }
            })
                .then(function (response) {
                    if (response) {
                        debugger;
                        $scope.myReservation.spotId = -1;
                        $scope.myReservation.enrolled = false;
                    }
                }).catch(function (error) {
                if (error.status === 403) {
                    $location.path('/login');
                }
            });
        }

        $scope.submitReservation = function() {

            $scope.clickReserve = true;
            if ($scope.reservations.some(function(element){
                return (element.userId === $scope.authInfo.userId);
            })) {
                $scope.reserveSuc = false;
                $scope.reserveMessage = "Sorry you've already reserved.";
                alert($scope.reserveMessage);
            } else {
                $scope.reserveSuc = true;
                $scope.reserveMessage = "Your just reserved successfully!";
                var body = {
                    userId: $scope.authInfo.userId,
                    spotId: $scope.selectedSeat,
                    classId: 1//to-do
                }
                console.log(body);
                $http.post($scope.reservationUrl, body, {
                    headers: {
                        'X-AuthToken': $scope.authInfo.token
                    }
                })
                    .then(function (response) {
                        $scope.reservations[$scope.selectedSeat - 1] = body;
                        $scope.selectedSeat = null;
                        alert($scope.reserveMessage);
                    }).catch(function (response) {
                    alert(response.data);
                });
                $scope.clickReserve = false;
            }
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
