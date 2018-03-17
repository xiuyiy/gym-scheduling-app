(function() {

    var app = angular.module('gym-schedule-app', ['ui.router']);

    app.config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/login');
        $stateProvider
            .state('login', {
                url: '/login',
                views: {
                    '': {
                        templateUrl: 'views/login.html',
                        controller: 'loginController'
                    }
                }
            })
            .state('register', {
                url: '/register',
                views: {
                    '': {
                        templateUrl: 'views/register.html',
                        controller: 'registerController'
                    }
                }
            })
            .state('registerAdmin', {
                url: '/register/admin',
                views: {
                    '': {
                        templateUrl: 'views/register.html',
                        controller: 'registerController'
                    }
                }
            })
            .state('countDown', {
                url: '/countDown',
                views: {
                    '': {
                        templateUrl: 'views/countDown.html',
                        controller: 'countDownController'
                    }
                }
            })
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
            .state('summary', {
                url: '/summary',
                views: {
                    '': {
                        templateUrl: 'views/summary.html',
                        controller: 'summaryController'
                    }
                }
            })

    });
}());
