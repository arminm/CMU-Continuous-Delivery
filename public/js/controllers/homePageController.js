angular.module('myApp')
  .directive('passwordEquality', function (){ 
    return {
      require: '?ngModel',
      link: function(scope, elem, attr, ngModel) {
          ngModel.$parsers.unshift(function (input1) {
             var input2 = attr.firstPassword;
             ngModel.$setValidity('passwordEquality', input1 === input2);
             return input1;
          });
      }
    };
  })
  .controller('homePageController', function($scope, $state, $location, JoinCommunity, User, Socket, $translate) {
    $scope.formData = {
      isRegistration: '',
      username: '',
      password: '',
      confirmPassword: '',
      fullName: ''
    };

    $scope.formError = {
      username: '',
      password: '',
      generic: ''
    };

    $scope.availableLanguages = [
      {
        id: "zh",
        language: "Chineze"
      },
      {
        id: "en",
        language: "English"
      },
      {
        id: "gr",
        language: "Greek"
      },
      {
        id: "ne",
        language: "Nepali"
      },
      {
        id: "fa",
        language: "Persian"
      },
    ];

    $scope.lang = {
      id: "en",
      language: "English"
    };

    $scope.changeLanguage = function () {
      $scope.translate.use($scope.lang.id);
    };

    $scope.register = function () {
      $scope.formData.isRegistration = true;
      // Call factory
      if ($scope.loginForm.$valid && ($scope.formData.confirmPassword.length > 0)) {
        var registerData = {
          password: $scope.formData.password,
          fullName: $scope.formData.fullName,
          createdAt: Date.now()
        };
        JoinCommunity.register($scope.formData.username, registerData)
          .success(function(data, status, headers, config) {
            if (status == '201') {
              User.setFirstTimeUser(status == '201');
              User.setUsername($scope.formData.username);
              User.setLastStatusUpdated(Date.now());
              User.setStatus('OK');
              User.setPrivilegeLevel('Citizen');
              Socket.emit('join', $scope.formData.username);
            } else {
              User.setUsername(data.username);
              User.setLastStatusUpdated(data.statusUpdatedAt);
              User.setStatus(data.statusCode);
              // Join a private room
              Socket.emit('join', data.username);
            }
            $scope.initializeSockets();
            $scope.findRole();
            $location.path('/lobby');
          })
          .error(function(data, status, headers, config) {
            if (status == '401') {
              $scope.formError.username = "Please enter a different username";
              $scope.loginForm.username.$setValidity('server', false);
            } else if (status == '403') {
                $scope.formError.generic = "Your account has been deactivated. Please contact an administrator";
                $scope.loginForm.$setValidity('server', false);
            } else {
              $scope.formError.generic = "Something went wrong. Please try again.";
              $scope.loginForm.$setValidity('server', false);
            }
          });
        }
    };
    $scope.login = function () {
      $scope.formData.isRegistration = false;
      // Call factory
      if ($scope.loginForm.$valid) {
        var loginData = {
          password: $scope.formData.password,
          lastLoginAt: Date.now()
        };
        JoinCommunity.login($scope.formData.username, loginData)
          .success(function(data, status, headers, config) {
            // Join a private room
            Socket.emit('join', data.username);
            User.setUsername(data.username);
            User.setLastStatusUpdated(data.statusUpdatedAt);
            User.setStatus(data.statusCode);
            User.setPrivilegeLevel(data.profile);
            // Go to next page
            $location.path('/lobby');
            $scope.findRole();
            $scope.initializeSockets();
          })
          .error(function(data, status, headers, config) {
              if (status == '401') {
                $scope.formError.password = "Your password is wrong";
                $scope.loginForm.password.$setValidity('server', false);
              } else if (status == '403') {
                $scope.formError.generic = "Your account has been deactivated. Please contact an administrator";
                $scope.loginForm.$setValidity('server', false);
              } else if (status == '404') {
                $scope.formError.generic = "User not found.";
                $scope.loginForm.$setValidity('server', false);
              } else {
                $scope.formError.generic = "Something went wrong. Please try again.";
                $scope.loginForm.$setValidity('server', false);
              }
          });
      }

    };
  });
