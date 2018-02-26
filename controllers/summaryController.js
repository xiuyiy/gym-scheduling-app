(function () {

    var injectParams = ['$scope', '$rootScope', '$http'];
    var summaryController = function ($scope, $rootScope, $http) {


        $scope.reservationUrl = "http://localhost:3000/reservations";

        $scope.generateSummary = function() {
            debugger;
            var currentDate = $scope.formatDate();
            $http.get($scope.reservationUrl + "?date=" + currentDate)
                .then(function(response){
                    $scope.oriReservations = response.data;
                    debugger;
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

            return [year, month, day].join('');
        };

        $scope.generateSummary();

    };



    summaryController.$inject = injectParams;

    angular.module('gym-schedule-app').controller('summaryController', summaryController);

}());