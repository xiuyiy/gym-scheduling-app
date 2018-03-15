angular.module('gym-schedule-app').factory('sessionService', function () {
    return {
        logout: function ($window, $location) {
            console.log("logging out!");
            $window.localStorage.removeItem("authInfo");
        }
        // ,
        // getMessage: function () {
        //     return msg;
        // }
    };
});
