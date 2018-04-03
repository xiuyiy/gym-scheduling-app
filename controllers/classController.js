var classController = function ($scope, $rootScope, $interval, $location, $window) {


    var titleSytle = 'black-title';

    $scope.firstName = (JSON.parse($window.localStorage.getItem("authInfo"))).firstName;
    $scope.classSchedule = [{},//11
        {
            "title": "WEIGHT TRAINING",
            "instructor": "KEVIN",
            "startTime": "7:00 AM",
            "duration": "45 MIN",
            "titleStyle": titleSytle
        },//12
        {
            "title": "TOTAL BODY",
            "instructor": "KEVIN",
            "startTime": "7:00 AM",
            "duration": "45 MIN",
            "titleStyle": titleSytle
        },//13
        {
            "title": "WEIGHT TRAINING",
            "instructor": "KEVIN",
            "startTime": "7:00 AM",
            "duration": "45 MIN",
            "titleStyle": titleSytle
        },//14
        {
            "title": "CORE STRENGTH",
            "instructor": "KEVIN",
            "startTime": "7:00 AM",
            "duration": "45 MIN",
            "titleStyle": titleSytle
        },//15

        {
            "title": "TOTAL BODY",
            "instructor": "KEVIN",
            "startTime": "12:00 PM",
            "duration": "45 MIN",
            "titleStyle": titleSytle
        },//21
        {
            "title": "VINYASA YOGA",
            "instructor": "YVETTE",
            "startTime": "12:00 PM",
            "duration": "45 MIN",
            "titleStyle": titleSytle
        },//22
        {
            "title": "50/50",
            "instructor": "HEIDI",
            "startTime": "12:00 PM",
            "duration": "45 MIN",
            "titleStyle": titleSytle
        },//23
        {
            "title": "VINYASA YOGA",
            "instructor": "YVETTE",
            "startTime": "12:00 PM",
            "duration": "45 MIN",
            "titleStyle": titleSytle
        },//24
        {
            "title": "TABATA",
            "instructor": "IULIIA",
            "startTime": "12:00 PM",
            "duration": "45 MIN",
            "titleStyle": titleSytle
        },//25

        {}, {}, {}, {}, {},//31-35

        {},//41
        {
            "title": "BARBELL STRENGTH (reservation starts at 1PM on Tue)",
            "ps": "20 people max",
            "instructor": "IULIIA",
            "startTime": "5:15 PM",
            "duration": "55 MIN",
            "openReservation": 2,
            "titleStyle": titleSytle
        }, //42
        {}, //43
        {
            "title": "BARBELL STRENGTH (reservation starts at 1PM on Thu)",
            "ps": "20 people max",
            "instructor": "IULIIA",
            "startTime": "5:15 PM",
            "duration": "55 MIN",
            "openReservation": 4,
            "titleStyle": titleSytle
        }, //44
        {}, //45
        {
            "title": "BODY EXTREME",
            "instructor": "IULIIA",
            "startTime": "6:00 PM",
            "duration": "45 MIN",
            "titleStyle": titleSytle
        }, //51
        {
            "title": "SPORTS CONDITIONING",
            "instructor": "IULIIA",
            "startTime": "6:10 PM",
            "duration": "45 MIN",
            "titleStyle": titleSytle
        }, //52
        {
            "title": "HIT BOOT CAMP",
            "instructor": "IULIIA",
            "startTime": "6:00 PM",
            "duration": "45 MIN",
            "titleStyle": titleSytle
        }, //53
        {
            "title": "ZUMBA",
            "instructor": "CHONA",
            "startTime": "6:10 PM",
            "duration": "45 MIN",
            "titleStyle": titleSytle
        }, //54
        {}
    ];


    $scope.matrixList = function (data, n) {
        var grid = [], i = 0, x = data.length, col, row = -1;
        for (var i = 0; i < x; i++) {
            col = i % n;
            if (col === 0) {
                grid[++row] = [];
            }
            grid[row][col] = data[i];
        }
        return grid;
    };

    $scope.InspireList = $scope.matrixList($scope.classSchedule, 5);


    $scope.flipColor = function () {
        var d = new Date();
        var weekday = d.getDay();
        var hour = d.getHours();

        if ((weekday == 2 || weekday == 4) && (hour >= 13 && hour <= 17)) {

            angular.forEach($scope.classSchedule, function (value, key) {


                if ((value.openReservation === 2 && weekday === 2) || (value.openReservation === 4 && weekday === 4)) {
                    // if ((value.openReservation === 2) || (value.openReservation === 4)) {

                    $scope.classSchedule[key].titleStyle = 'lime-title';
                } else {
                    $scope.classSchedule[key].titleStyle = 'black-title';
                }
            });
        }
    };

    $scope.autoRefresh = $interval($scope.flipColor(), 3000);
    $scope.flipColor();

    $scope.goToReservationPage = function (val) {

        if (val.titleStyle === 'lime-title') {
            $location.path('/reserve');
        }
    }

    $scope.logout = function () {
        $window.localStorage.removeItem("authInfo");
        $location.path('/login');
    }
}

angular.module('gym-schedule-app').controller('classController', classController);
