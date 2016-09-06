// Controller of catalog Page.
appControllers.controller('authCtrl', function ($scope, $mdToast, $mdDialog, resApi) {

    
    $scope.login = function (loginData) {
       
        resApi.auth.local(loginData).then(
            function(success){

            },
            function(error){

            });
    }

    $scope.signup = function(signupData) {
        resApi.user.create(signupData).then(
            function(success){

            },
            function(error){

            });
    }
});// End of auth controller.