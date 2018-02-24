var classController = function ($scope, $rootScope) {
    $scope.classSchedule = [{},//11
        {
            "title": "WEIGHT TRAINING",
            "instructor": "KEVIN",
            "startTime": "7:00 AM",
            "duration": "45 MIN"
        },//12
        {
            "title": "TOTAL BODY",
            "instructor": "KEVIN",
            "startTime": "7:00 AM",
            "duration": "45 MIN"
        },//13
        {
            "title": "WEIGTH TRAINING",
            "instructor": "KEVIN",
            "startTime": "7:00 AM",
            "duration": "45 MIN"
        },//14
        {
            "title": "CORE STRENGTH",
            "instructor": "KEVIN",
            "startTime": "7:00 AM",
            "duration": "45 MIN"
        },//15

        {
            "title": "TOTAL BODY",
            "instructor": "KEVIN",
            "startTime": "12:00 PM",
            "duration": "45 MIN"
        },//21
        {
            "title": "VINYASA YOGA",
            "instructor": "YVETTE",
            "startTime": "12:00 PM",
            "duration": "45 MIN"
        },//22
        {
            "title": "50/50",
            "instructor": "HEIDI",
            "startTime": "12:00 PM",
            "duration": "45 MIN"
        },//23
        {
            "title": "VINYASA YOGA",
            "instructor": "YVETTE",
            "startTime": "12:00 PM",
            "duration": "45 MIN"
        },//24
        {
            "title": "TABATA",
            "instructor": "IULIIA",
            "startTime": "12:00 PM",
            "duration": "45 MIN"
        },//25

        {}, {}, {}, {}, {},//31-35

        {},//41
        {
            "title": "BARBELL STRENGTH",
            "ps": "20 people max",
            "instructor": "IULIIA",
            "startTime": "5:15 PM",
            "duration": "55 MIN"
        }, //42
        {}, //43
        {
            "title": "BARBELL STRENGTH",
            "ps": "20 people max",
            "instructor": "IULIIA",
            "startTime": "5:15 PM",
            "duration": "55 MIN"
        }, //44
        {}, //45
        {
            "title": "BODY EXTREME",
            "instructor": "IULIIA",
            "startTime": "6:00 PM",
            "duration": "45 MIN"
        }, //51
        {
            "title": "SPORTS CONDITIONING",
            "instructor": "IULIIA",
            "startTime": "6:10 PM",
            "duration": "45 MIN"
        }, //52
        {
            "title": "HIT BOOT CAMP",
            "instructor": "IULIIA",
            "startTime": "6:00 PM",
            "duration": "45 MIN"
        }, //53
        {
            "title": "Zumba",
            "instructor": "CHONA",
            "startTime": "6:10 PM",
            "duration": "45 MIN"
        }, //54
        {}
    ];


    $scope.matrixList = function (data, n) {
        debugger;
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
}

angular.module('gym-schedule-app').controller('classController', classController);
