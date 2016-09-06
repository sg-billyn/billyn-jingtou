// For using adMob Pro you have to install AdMob pro plugin by running the following
// command in your cmd.exe for windows or Terminal for mac:
//
// $ cd your_project_path
// $ ionic platform remove ios
// $ ionic platform remove android
// $ ionic plugin remove cordova-plugin-admobpro
// $ ionic plugin add cordova-plugin-admobpro
// $ ionic platform add ios
// $ ionic platform add android
// $ ionic build ios
// $ ionic build android
//
// Learn more about adMob Pro :
// https://github.com/floatinghotpot/cordova-admob-pro#quick-start
// Controller of google AdMob page.

appControllers.controller('googleAdmobCtrl', function ($scope) {

    // initialForm is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {

        // $scope.isTurnOn is AdMob status.
        $scope.isTurnOn = true;

        //$scope.admob_key is from window.globalVariable.oAuth.adMob in www/js/app.js at globalVariable session.
        $scope.admob_key = window.globalVariable.adMob;

        // Calling to initial AdMob.
        $scope.initAdMob();
        //If you start your application with google Admob feature.
        //You have to add timeout for 2 sec before run it.

    };//End initialForm.

    // initAdMob for initial AdMob
    $scope.initAdMob = function () {

        if (! AdMob ) { alert( 'admob plugin not ready' ); return; }
        $scope.createAdMobBanner();

    };//End initAdMob.

    //createAdMobBanner is for create new adMob banner.
    $scope.createAdMobBanner = function () {
        AdMob.createBanner( {
            adId: $scope.admob_key,
            isTesting: false,
            position: AdMob.AD_POSITION.BOTTOM_CENTER // Set AdMob.AD_POSITION.TOP_CENTER for show banner at top section
        } );
    };//End createAdMobBanner

     // Call adMob() for turn on and off AdMob.
    $scope.adMob = function () {
        // Turn off AdMob.
        if ($scope.isTurnOn) {
            AdMob.removeBanner();
            $scope.isTurnOn = false;
        }
        // Turn on AdMob.
        else {
            $scope.createAdMobBanner();
            $scope.isTurnOn = true;
        }
    };//End adMob.

    $scope.initialForm();
});// End of google Admob Controller.
