(function() {

    var app = angular.module('gym-schedule-app', ['ui.router']);

    app.config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/reserve');
        $stateProvider
            .state('signup', {
                url: '/signup',
                views: {
                    '': {
                        templateUrl: 'views/index.html',
                        controller: 'signUpController'
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
