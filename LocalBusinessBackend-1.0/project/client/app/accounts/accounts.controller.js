'use strict';

angular.module('localBusinessApp')
  .controller('AccountsPhotoCtrl', ['$scope', '$rootScope', '$location', '$log',
    '$q', 'Accounts', '$window', 'Media', 'ImageUploader',
    function($scope, $rootScope, $location, $log, $q, Accounts, $window, Media,
      ImageUploader) {
      // When the user removes an image we are placing it in our thrash bin.
      // The content of this bin will be used during the from's save process.
      $scope.trashbin = [];

      $scope.data = {
        // Keeps track of the images
        // that are uploaded while the form is still
        // dirty. These images should be serialized or deleted
        uploadedImages: [],
        // The model the contols are binded to.
        // Its fields are coresponding to our record fields
        model: {}
      };

      // Keeps UI related information
      // states, progress etc.
      $scope.ui = {};
      $scope.ui.progress = 0;
      $scope.ui.inProgress = false;

      /*jshint unused: false */
      function progressStart() {
        $scope.ui.inProgress = true;
      }

      function progressEnd() {
          $scope.ui.inProgress = false;
        }
        /*jshint unused: true */

      Accounts.get()
        .then(function(response) {
          var body = response.data;
          $scope.data.model = body.result[0];
          $scope.ui.pictures = [];

          for (var i in $scope.data.model.media) {
            $scope.ui.pictures.push($scope.data.model.media[i].uri);
          }
        })
        .catch(function(response) {
          $log.error('response', response);
        });

      /**
       * Listen on file select
       */
      $scope.onFileSelect = ImageUploader.onFileSelectForUpdateMulti($scope);

      $scope.update = function() {
        progressStart();

        function saveAccounts(mediaIds) {
            var totalMediaIDs = $scope.data.model.media.concat((mediaIds));

            $scope.data.model.media = totalMediaIDs;

            Accounts.update($scope.data.model._id, $scope.data.model)
              .then(function onSuccess(response) {
                progressEnd();

                $.notify('All the changes have been saved.', {
                  'status': 'success'
                } || {});

                // notify the listener when the record is updated
                $scope.$emit('list_updated');
              })
              .catch(function(response) {
                progressEnd();
                $log.error('response', response);
              });
          } //saveAccounts()

        function saveMedia() {
            var proms = [];

            for (var i in $scope.data.uploadedImages) {
              proms.push(Media.create($scope.data.uploadedImages[i]));
            }

            $q.all(proms)
              .then(function(values) {
                // make sure the staged images is back to empty state
                $scope.data.uploadedImages = [];

                var mediaIds = [];
                for (var i in values) {
                  mediaIds.push(values[i].data.result._id);
                }
                saveAccounts(mediaIds);
              });
          } //saveMedia()

        // // Clean up media placed in the trash bin
        function deleteMedia(id) {
          Media.delete(id)
            .then(function onSuccess(response) {
              console.log(response);
            })
            .catch(function onError(response) {
              console.log(response);
            });
        }

        if ($scope.trashbin.length > 0) {
          var toBeDeleteImages = [];
          for (var key in $scope.trashbin) {
            toBeDeleteImages.push(Media.delete($scope.trashbin[key]));
          }

          $q.all(toBeDeleteImages)
            .then(function(response) {
              progressEnd();
              console.log(response);
            })
            .catch(function(response) {
              console.log(response);
            });
        }

        // If a media is given and uploaded, save the media, get its id
        // and proceed with the save of page
        if ($scope.data.uploadedImages.length > 0) {
          saveMedia();
        } else {
          saveAccounts([]);
        }
      };

      /**
       * Delete the current image
       */
      $scope.deleteImage = function(index) {

        // Store the media id in order to delete
        // this entry in the future
        var mediaID;
        // Check if the requested for deletion
        // image is part of the images already stored in our model
        //
        // Please note that the total number of images
        // in the UI may be more that those in the model:
        // The use may has staged (uploaded but not saved)
        // additional images.
        if ($scope.data.model.media.length > index) {
          mediaID = $scope.data.model.media[index]._id;

          $scope.trashbin.push(mediaID);
          // Remove the image reference for the categories object
          $scope.data.model.media.splice(index, 1);
        } else {
          // It is a temporarily uploaded image
          // Calculate its new index (in the uploaded array)
          var reducedIndex = index - $scope.data.model.media.length;
          // Remove it for the array in order
          // to prevent its serialization on update (save)
          $scope.data.uploadedImages.splice(reducedIndex, 1);

        }

        // Remove the image preview
        $scope.ui.pictures.splice(index, 1);

        // Set the progress bar
        $scope.ui.progress = 0;
      };

      // listen to hide news list update event
      var listUpdatedListener = $rootScope.$on('list_updated', function() {

        // fetch the list
        Accounts.get().then(function(response) {
          var body = response.data;
          $scope.data.model = body.result[0];
          $scope.ui.pictures = [];

          for (var i in $scope.data.model.media) {
            $scope.ui.pictures.push($scope.data.model.media[i].uri);
          }
        });
      });

      $scope.cancel = function() {
        $.notify('All the changes have been canceled.', {
          'status': 'info'
        } || {});

        // notify the listener when the news is added
        $scope.$emit('list_updated');
      };

      // notify the listener when the news is added
      $scope.$emit('list_updated');

      // unregister the listener to avoid memory leak
      $scope.$on('$destroy', listUpdatedListener);

      $(window).trigger('resize');
    }
  ]);

angular.module('localBusinessApp')
  .controller('AccountsBusinessCtrl', ['$scope', '$rootScope', '$location', '$log',
    '$q', 'Accounts', '$window',
    function($scope, $rootScope, $location, $log, $q, Accounts, $window) {

      $scope.data = {
        // The model the contols are binded to.
        // Its fields are coresponding to our record fields
        model: {}
      };

      // Keeps UI related information
      // states, progress etc.
      $scope.ui = {};
      $scope.ui.progress = 0;
      $scope.ui.inProgress = false;

      /*jshint unused: false */
      function progressStart() {
        $scope.ui.inProgress = true;
      }

      function progressEnd() {
          $scope.ui.inProgress = false;
        }
        /*jshint unused: true */

      // Time picker
      $scope.ismeridian = false;
      $scope.hstep = 1;
      $scope.mstep = 15;
      // $scope.timezone = 0;
      // $scope.openHours = [
      //   {day: 1, openAt: null, closeAt: null},
      //   {day: 2, openAt: null, closeAt: null},
      //   {day: 3, openAt: null, closeAt: null},
      //   {day: 4, openAt: null, closeAt: null},
      //   {day: 5, openAt: null, closeAt: null}
      // ];

      /**
       * Add Open Hour inputs with empty values
       */
      $scope.addOpenHourInputs = function() {
        $scope.data.model.business.hours.days.push({
          day: 1,
          openAt: null,
          closeAt: null
        });
      };

      $scope.removeOpenHourInputs = function(index) {
        $scope.data.model.business.hours.days.splice(index, 1);
      };

      // listen to hide news list update event
      var listUpdatedListener = $rootScope.$on('list_updated', function() {
        // fetch the list
        Accounts.get().then(function(response) {
          var body = response.data;
          $scope.data.model = body.result[0];
        });
      });

      $scope.update = function() {
        progressStart();

        for (var i = 0; i < $scope.data.model.business.hours.days.length; i++) {
          var d = $scope.data.model.business.hours.days[i];
          d.openAt = new Date(d.openAt).getTime();
          d.closeAt = new Date(d.closeAt).getTime();
          $scope.data.model.business.hours.days[i] = d;
        }

        Accounts.update($scope.data.model._id, $scope.data.model)
          .then(function onSuccess(response) {
            progressEnd();

            $.notify('All the changes have been saved.', {
              'status': 'success'
            } || {});

            // notify the listener when the news is added
            $scope.$emit('list_updated');

          })
          .catch(function(response) {
            function onError(response) {
              progressEnd();
              $log.error('response', response);
            }
          });
      };

      $scope.cancel = function() {
        $.notify('All the changes have been canceled.', {
          'status': 'info'
        } || {});

        // notify the listener when the news is added
        $scope.$emit('list_updated');
      };

      // notify the listener when the news is added
      $scope.$emit('list_updated');

      // unregister the listener to avoid memory leak
      $scope.$on('$destroy', listUpdatedListener);

      $(window).trigger('resize');
    }
  ]);

angular.module('localBusinessApp')
  .controller('AccountsContactCtrl', ['$scope', '$rootScope', '$location', '$log',
    '$q', 'Accounts', '$window',
    function($scope, $rootScope, $location, $log, $q, Accounts, $window) {

      $scope.data = {
        // The model the contols are binded to.
        // Its fields are coresponding to our record fields
        model: {}
      };

      // Keeps UI related information
      // states, progress etc.
      $scope.ui = {};
      $scope.ui.progress = 0;
      $scope.ui.inProgress = false;

      /*jshint unused: false */
      function progressStart() {
        $scope.ui.inProgress = true;
      }

      function progressEnd() {
          $scope.ui.inProgress = false;
        }
        /*jshint unused: true */

      // listen to hide news list update event
      var listUpdatedListener = $rootScope.$on('list_updated', function() {
        // fetch the list
        Accounts.get().then(function(response) {
          var body = response.data;
          $scope.data.model = body.result[0];
        });
      });

      $scope.update = function() {
        progressStart();

        Accounts.update($scope.data.model._id, $scope.data.model)
          .then(function onSuccess(response) {
            progressEnd();

            $.notify('All the changes have been saved.', {
              'status': 'success'
            } || {});

            // notify the listener when the news is added
            $scope.$emit('list_updated');

          })
          .catch(function(response) {
            function onError(response) {
              progressEnd();
              $log.error('response', response);
            }
          });
      };

      $scope.cancel = function() {
        $.notify('All the changes have been canceled.', {
          'status': 'info'
        } || {});

        // notify the listener when the news is added
        $scope.$emit('list_updated');
      };

      // notify the listener when the news is added
      $scope.$emit('list_updated');

      // unregister the listener to avoid memory leak
      $scope.$on('$destroy', listUpdatedListener);

      $(window).trigger('resize');
    }
  ]);
