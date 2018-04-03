(function () {

    var injectParams = ['$scope', '$rootScope', '$http', '$location'];

    var registerController = function ($scope, $rootScope, $http, $location) {

        var absUrl = $location.absUrl();

        $scope.isAdminPage = absUrl.includes('/register/admin');
        $scope.isAdminUser = false;
        $scope.adminAnswer = null;

        $scope.newUser = {
            firstName: null,
            lastName: null,
            email: null,
            password: null,
        };

        $(function () {
            $('[data-toggle="tooltip"]').tooltip()
        })

        $scope.registerSuccess = false;

        $scope.backendUrl = "http://env-89392-elb-2129585381.us-east-1.elb.amazonaws.com:3001/";


        $scope.registerValidation = {
            firstName: {
                validationInputClass: 'form-control'
            },
            lastName: {
                validationInputClass: 'form-control'
            },
            email: {
                validationInputClass: 'form-control'
            },
            password: {
                validationInputClass: 'form-control'
            },
            password2: {
                validationInputClass: 'form-control'
            }
        };

        var validateEmail = function(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            return re.test(String(email).toLowerCase());
        }

        var validateRegisterForm = function (newUser) {
            var isValid = true;
            debugger;
            if (!newUser) {
                $scope.registerValidation = {
                    firstName: {
                        validationInputClass: 'form-control is-invalid',
                        validationFeedbackClass: 'invalid-feedback',
                        validationMessage: 'Please provide your first name!'
                    },
                    lastName: {
                        validationInputClass: 'form-control is-invalid',
                        validationFeedbackClass: 'invalid-feedback',
                        validationMessage: 'Please provide your last name!'
                    },
                    email: {
                        validationInputClass: 'form-control is-invalid',
                        validationFeedbackClass: 'invalid-feedback',
                        validationMessage: 'Please provide a valid email address!'
                    },
                    password: {
                        validationInputClass: 'form-control is-invalid',
                        validationFeedbackClass: 'invalid-feedback',
                        validationMessage: 'Please provide your password!'
                    },
                    password2: {
                        validationInputClass: 'form-control is-invalid',
                        validationFeedbackClass: 'invalid-feedback',
                        validationMessage: 'Please re-enter your password!'
                    }
                };
                return false;
            }
            //validate first name
            if (!newUser.firstName) {
                $scope.registerValidation.firstName = {
                    validationInputClass: 'form-control is-invalid',
                    validationFeedbackClass: 'invalid-feedback',
                    validationMessage: 'Please provide your first name!'
                };
                isValid = false;
            } else {
                $scope.registerValidation.lastName = {
                    validationInputClass: 'form-control is-valid',
                    validationFeedbackClass: 'valid-feedback'
                };
            }

            //validate last name
            if (!newUser.lastName) {
                $scope.registerValidation.lastName = {
                    validationInputClass: 'form-control is-invalid',
                    validationFeedbackClass: 'invalid-feedback',
                    validationMessage: 'Please provide your last name!'
                };
                isValid = false;
            } else {
                $scope.registerValidation.lastName = {
                    validationInputClass: 'form-control is-valid',
                    validationFeedbackClass: 'valid-feedback'
                };
            }

            //validate email address
            if (!newUser.email) {
                $scope.registerValidation.email = {
                    validationInputClass: 'form-control is-invalid',
                    validationFeedbackClass: 'invalid-feedback',
                    validationMessage: 'Please provide your email address!'
                }
                isValid = false;
            } else if (!validateEmail(newUser.email)) {
                $scope.registerValidation.email = {
                    validationInputClass: 'form-control is-invalid',
                    validationFeedbackClass: 'invalid-feedback',
                    validationMessage: 'Please provide a valid email address!'
                }
                isValid = false;
            } else {
                $scope.registerValidation.email = {
                    validationInputClass: 'form-control is-valid',
                    validationFeedbackClass: 'valid-feedback'
                };
            }

            if (!newUser.password) {
                $scope.registerValidation.password = {
                    validationInputClass: 'form-control is-invalid',
                    validationFeedbackClass: 'invalid-feedback',
                    validationMessage: 'Please provide your password!'
                };
                isValid = false;
            } else if (newUser.password.length < 8) {
                $scope.registerValidation.password = {
                    validationInputClass: 'form-control is-invalid',
                    validationFeedbackClass: 'invalid-feedback',
                    validationMessage: 'The length of the password must be at least 8!'
                };
                isValid = false;
            } else {
                $scope.registerValidation.password = {
                    validationInputClass: 'form-control is-valid',
                    validationFeedbackClass: 'valid-feedback'
                }
            }

            if (!newUser.password2) {
                $scope.registerValidation.password2 = {
                    validationInputClass: 'form-control is-invalid',
                    validationFeedbackClass: 'invalid-feedback',
                    validationMessage: 'Please provide your password!'
                };
                isValid = false;
            } else if (newUser.password2.length < 8) {
                $scope.registerValidation.password2 = {
                    validationInputClass: 'form-control is-invalid',
                    validationFeedbackClass: 'invalid-feedback',
                    validationMessage: 'The length of the password must be at least 8!'
                };
                isValid = false;
            } else {
                $scope.registerValidation.password2 = {
                    validationInputClass: 'form-control is-valid',
                    validationFeedbackClass: 'valid-feedback'
                }
            }

            //if 2 passwords do not match
            if (newUser.password && newUser.password2 && newUser.password !== newUser.password2) {
                $scope.registerValidation.password2 = {
                    validationInputClass: 'form-control is-invalid',
                    validationFeedbackClass: 'invalid-feedback',
                    validationMessage: 'Please make sure the password you re-entered matches the previous one!'
                };
                isValid = false;
            }

            return isValid;

        }
        $scope.registerUser = function () {

            //form validation
            if (!validateRegisterForm($scope.newUser)) {
                return;
            }

            if($scope.isAdminPage&&$scope.adminAnswer&&$scope.adminAnswer.trim() === '-1/12') {
                $scope.newUser.isAdmin = true;
            }else{
                $scope.newUser.isAdmin = false;
            }
            $http.post($scope.backendUrl + "users", $scope.newUser)
                .then(function (response) {
                    if (response.status === 200) {
                        $scope.registerSuccess = true;
                        //user exists in the database already
                    } else if (response.status === 409) {
                        $scope.registerSuccess = false;
                        var returnedUser = response.data;
                        if (returnedUser.isActive) {
                            $scope.activeUserExists = true;
                        } else {
                            $scope.userExistsButNotActivated = true;
                        }
                    }
                }).catch(function (response) {
                alert(response.data);
            });

        }

        $scope.goToLoginPage = function () {
            $location.path('/login');
        };

    }

    registerController.$inject = injectParams;

    angular.module('gym-schedule-app').controller('registerController', registerController);

}());