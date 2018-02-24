(function() {

    var app = angular.module('gym-schedule-app', ['ui.router', 'ui.bootstrap', 'ui.select', 'mwl.calendar']);

    app.config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/signUp');
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
    });
}());
