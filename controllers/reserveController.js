/**
 Created by Ming He on Feb 24, 2018
 **/

(function () {

    var injectParams = ['$scope', '$rootScope', '$http', '$window', '$location', "sessionService"];

    var reserveController = function ($scope, $rootScope, $http, $window, $location, sessionService) {
        //var currentDate = new Date();
        //var className = "Barbell";
        // $scope.reservationUrl = "http://mac-mhe2.corp.microstrategy.com:3000/reservations";


        $scope.getNavClass = function (currPage) {
            if ($scope.isSummaryPage) {
                if (currPage === 'myReservation') {
                    return 'nav-item';
                }
                else {
                    return 'nav-item active';
                }
            } else {
                if (currPage === 'myReservation') {
                    return 'nav-item active';
                }
                else {
                    return 'nav-item';
                }
            }
        };


        $scope.reservationUrl = "http://localhost:3000/reservations";
        $scope.getDisplayDate = function () {
            var d = new Date();
            const MONTH_NAMES = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
            ];
            $scope.month = MONTH_NAMES[d.getMonth()];
            $scope.weekday = WEEKDAY_NAMES[d.getDay()];
            $scope.day = d.getDate();
        }

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

        $scope.generateReservations = function () {
            $http.get($scope.reservationUrl + "?date=" + $scope.today, {
                headers: {'X-AuthToken': $scope.authInfo.token}
            })
                .then(function (response) {
                    $scope.oriReservations = response.data;
                    $scope.renderReservations();
                }).catch(function (error) {
                if (error.status === 403) {
                    $location.path('/login');
                }
            })
        };

        //this method will retrieve today's reservations along with its users
        $scope.getReservationsAndUsers = function () {
            $http.get($scope.reservationUrl + "?date=" + $scope.today + "&returnUserInfo=true", {
                headers: {'X-AuthToken': $scope.authInfo.token}
            }).then(function (response) {
                $scope.reservationsUserInfos = response.data;
            }).catch(function (error) {
                if (error.status === 403) {
                    $location.path('/login');
                }
            })
        };

        $scope.renderReservations = function () {
            $scope.totalNumber = 20;
            $scope.reservations = [];//0-19
            for (var i = 1; i <= $scope.totalNumber; i++) {
                var res = $scope.oriReservations.filter(function (element) {
                    return (element.spotId == i);
                });
                if (res.length > 0) {
                    $scope.reservations[i - 1] = res[0];
                } else {
                    $scope.reservations[i - 1] = {};
                }
            }
        };

        $scope.cancelReservation = function () {
            $scope.reserveMessage = null;
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
                        $scope.clickReserve = false;
                        $scope.reserveMessage = "Cancellation succeed!"
                    }
                }).catch(function (error) {
                if (error.status === 403) {
                    $location.path('/login');
                }
            });
        }

        $scope.submitReservation = function () {

            if ($scope.reservations.some(function (element) {
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
                        //0-19
                        $scope.reservations[$scope.selectedSeat - 1] = body;

                        // alert($scope.reserveMessage);
                        $scope.generateReservations();
                        $scope.myReservation.spotId = $scope.selectedSeat;
                        $scope.selectedSeat = null;
                        $scope.myReservation.enrolled = true;
                    }).catch(function (response) {
                    alert(response.data);
                });
                $scope.clickReserve = false;
            }
        };

        //index ranging from 0-19
        $scope.selectSeat = function (index) {
            $scope.reserveMessage = null;
            //it is possible that user has userId==0
            if ($scope.reservations[index].userId !== 0 && !$scope.reservations[index].userId) {
                //selectedSeat ranging from 1-20
                $scope.selectedSeat = index + 1;
                $scope.clickReserve = true;
                //only modify the spotId if the user is not enrolled
                if (!$scope.myReservation.enrolled) {
                    $scope.myReservation.spotId = $scope.selectedSeat;
                }
            } else {
                //alert("The seat is already occupied!");
            }
        };

        $scope.logout = function () {
            $window.localStorage.removeItem("authInfo");
            $location.path('/login');
        }


        // function initScope() {

        var absUrl = $location.absUrl();
        $scope.getDisplayDate();

        $scope.isSummaryPage = absUrl.includes('/summary');
        $scope.authInfo = JSON.parse($window.localStorage.getItem("authInfo"));

        $scope.today = $scope.formatDate();

        $scope.getCurrentUserReservations();

        $scope.getReservationsAndUsers();
        $scope.generateReservations();
        // }

        // initScope();

        // $scope.$on('$routeChangeUpdate', initScope);
        // $scope.$on('$routeChangeSuccess', initScope);

        $scope.goToSummaryPage = function () {
            $location.path('/summary');
        }

        $scope.goToMyReservationPage = function () {
            $location.path('/reserve');
        }

        $scope.removeUserReservation = function (userId) {
            $http({
                method: 'DELETE',
                url: $scope.reservationUrl + "?date=" + $scope.today + "&userId=" + userId,
                headers: {
                    'X-AuthToken': $scope.authInfo.token
                }
            })
                .then(function (response) {
                    if (response) {
                        $scope.getReservationsAndUsers();
                        $scope.renderReservations();
                    }
                }).catch(function (error) {
                if (error.status === 403) {
                    $location.path('/login');
                }
            });
        }

    };

    reserveController.$inject = injectParams;

    angular.module('gym-schedule-app').controller('reserveController', reserveController);

}());
