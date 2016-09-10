appControllers.controller('MySpacesCtrl', function($scope, $rootScope, $state, $ionicPopup, AuthService, BSpace){
    $scope.mySpaces ={};
    var me = $rootScope.current.user;
    var c = AuthService.currentUser();

    // BSpace.getAllSpaces().then(s => {
    //   var a = s;
    //   var b = s.length;
    // });
    BSpace.getUserSpaces(me._id).then(function (spaces) {
     $scope.mySpaces = spaces;
    });
});
