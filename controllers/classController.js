var classController = function ($scope, $rootScope, $interval, $location) {
    var titleSytle = 'black-title';
    $scope.classSchedule = [{},//11
        {
            "title": "WEIGHT TRAINING",
            "instructor": "KEVIN",
            "startTime": "7:00 AM",
            "duration": "45 MIN",
            "color": titleSytle
        },//12
        {
            "title": "TOTAL BODY",
            "instructor": "KEVIN",
            "startTime": "7:00 AM",
            "duration": "45 MIN",
            "color": titleSytle
        },//13
        {
            "title": "WEIGHT TRAINING",
            "instructor": "KEVIN",
            "startTime": "7:00 AM",
            "duration": "45 MIN",
            "color": titleSytle
        },//14
        {
            "title": "CORE STRENGTH",
            "instructor": "KEVIN",
            "startTime": "7:00 AM",
            "duration": "45 MIN",
            "color": titleSytle
        },//15

        {
            "title": "TOTAL BODY",
            "instructor": "KEVIN",
            "startTime": "12:00 PM",
            "duration": "45 MIN",
            "color": titleSytle
        },//21
        {
            "title": "VINYASA YOGA",
            "instructor": "YVETTE",
            "startTime": "12:00 PM",
            "duration": "45 MIN",
            "color": titleSytle
        },//22
        {
            "title": "50/50",
            "instructor": "HEIDI",
            "startTime": "12:00 PM",
            "duration": "45 MIN",
            "color": titleSytle
        },//23
        {
            "title": "VINYASA YOGA",
            "instructor": "YVETTE",
            "startTime": "12:00 PM",
            "duration": "45 MIN",
            "color": titleSytle
        },//24
        {
            "title": "TABATA",
            "instructor": "IULIIA",
            "startTime": "12:00 PM",
            "duration": "45 MIN",
            "color": titleSytle
        },//25

        {}, {}, {}, {}, {},//31-35

        {},//41
        {
            "title": "BARBELL STRENGTH",
            "ps": "20 people max",
            "instructor": "IULIIA",
            "startTime": "5:15 PM",
            "duration": "55 MIN",
            "openReservation": 2,
            "color": titleSytle
        }, //42
        {}, //43
        {
            "title": "BARBELL STRENGTH",
            "ps": "20 people max",
            "instructor": "IULIIA",
            "startTime": "5:15 PM",
            "duration": "55 MIN",
            "openReservation": 4,
            "color": titleSytle
        }, //44
        {}, //45
        {
            "title": "BODY EXTREME",
            "instructor": "IULIIA",
            "startTime": "6:00 PM",
            "duration": "45 MIN",
            "color": titleSytle
        }, //51
        {
            "title": "SPORTS CONDITIONING",
            "instructor": "IULIIA",
            "startTime": "6:10 PM",
            "duration": "45 MIN",
            "color": titleSytle
        }, //52
        {
            "title": "HIT BOOT CAMP",
            "instructor": "IULIIA",
            "startTime": "6:00 PM",
            "duration": "45 MIN",
            "color": titleSytle
        }, //53
        {
            "title": "ZUMBA",
            "instructor": "CHONA",
            "startTime": "6:10 PM",
            "duration": "45 MIN",
            "color": titleSytle
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

        if ((weekday == 2 || weekday == 6) && (hour >= 13 && hour <= 24)) {

            angular.forEach($scope.classSchedule, function (value, key) {


                if ((value.openReservation === 2 && weekday === 2) || (value.openReservation === 4 && weekday === 6)) {
                    $scope.classSchedule[key].color = 'lime-title';
                } else {
                    $scope.classSchedule[key].color = 'black-title';
                }
            });
        }
    }

    $scope.autoRefresh = $interval($scope.flipColor(), 3000);
    $scope.flipColor();

    $scope.goToReservationPage = function (val) {

        if (val.color === 'lime-title') {
            $location.path('/reserve.html');
        }
    }
}

angular.module('gym-schedule-app').controller('classController', classController);
