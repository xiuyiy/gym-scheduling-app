(function() {

    var app = angular.module('gym-schedule-app', ['ui.router']);

    app.config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/reserve');
        $stateProvider
            .state('class', {
                url: '/class',
                views: {
                    '': {
                        templateUrl: 'views/class.html',
                        controller: 'classController'
                    }
                }
            })
            .state('reserve', {
                url: '/reserve',
                views: {
                    '': {
                        templateUrl: 'views/reserve.html',
                        controller: 'reserveController'
                    }
                }
            })
    });
}());
