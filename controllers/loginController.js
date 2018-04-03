(function () {

    var injectParams = ['$scope', '$rootScope', '$location', '$http', '$window'];

    var loginController = function ($scope, $rootScope, $location, $http, $window) {

        $(function () {
            $('[data-toggle="tooltip"]').tooltip()
        })

        $scope.currentUser = {
            email: null,
            password: null
        };

        $scope.loginError;

        $scope.backendUrl = "http://env-89392-elb-2129585381.us-east-1.elb.amazonaws.com:3001/";

        var validateEmail = function(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            return re.test(String(email).toLowerCase());
        }

        $scope.loginValidation = {
            email: {
                validationInputClass: 'form-control'
            },
            password: {
                validationInputClass: 'form-control'
            }
        };

        var validateLoginForm = function (currUser) {
            var isValid = true;
            if (!currUser) {
                $scope.loginValidation = {
                    email: {
                        validationInputClass: 'form-control is-invalid',
                        validationFeedbackClass: 'invalid-feedback',
                        validationMessage: 'Please provide your email address!'
                    },
                    password: {
                        validationInputClass: 'form-control is-invalid',
                        validationFeedbackClass: 'invalid-feedback',
                        validationMessage: 'Please provide your password!'
                    }
                };
                return false;
            }

            if (!currUser.email) {
                $scope.loginValidation.email = {
                    validationInputClass: 'form-control is-invalid',
                    validationFeedbackClass: 'invalid-feedback',
                    validationMessage: 'Please provide your email address!'
                }
                isValid = false;
            } else if (!validateEmail(currUser.email)) {
                $scope.loginValidation.email = {
                    validationInputClass: 'form-control is-invalid',
                    validationFeedbackClass: 'invalid-feedback',
                    validationMessage: 'Please provide a valid email address!'
                }
                isValid = false;
            } else {
                $scope.loginValidation.email = {
                    validationInputClass: 'form-control is-valid',
                    validationFeedbackClass: 'valid-feedback'
                };
            }

            if (!currUser.password) {
                $scope.loginValidation.password = {
                    validationInputClass: 'form-control is-invalid',
                    validationFeedbackClass: 'invalid-feedback',
                    validationMessage: 'Please provide your password!'
                };
                isValid = false;
            } else if (currUser.password.length < 8) {
                $scope.loginValidation.password = {
                    validationInputClass: 'form-control is-invalid',
                    validationFeedbackClass: 'invalid-feedback',
                    validationMessage: 'The length of the password must be at least 8!'
                };
                isValid = false;
            } else {
                $scope.loginValidation.password = {
                    validationInputClass: 'form-control is-valid',
                    validationFeedbackClass: 'valid-feedback'
                }
            }
            return isValid;
        }




        $scope.login = function () {

            if (!validateLoginForm($scope.currentUser)) {
                return;
            }

            $http.post($scope.backendUrl + "login", $scope.currentUser)
                .then(function (res) {
                    if(!res.data.isActive) {
                        $scope.loginError = 'please check your inbox to confirm the registration';
                        return;
                    }
                    $window.localStorage.setItem("authInfo",JSON.stringify(res.data));
                    // var backend = JSON.parse($window.localStorage.getItem("authInfo"));
                    $scope.getToClassPage();
                    }).catch(function (error) {
                $scope.loginError = error.data;
            });
        }

        $scope.goToRegisterPage = function () {
            $location.path('/register');
        }

        $scope.getToClassPage = function () {
            $location.path('/class');
        }
    }

    loginController.$inject = injectParams;

    angular.module('gym-schedule-app').controller('loginController', loginController);

}());