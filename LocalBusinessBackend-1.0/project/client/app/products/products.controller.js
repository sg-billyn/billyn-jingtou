'use strict';

angular.module('localBusinessApp')
  .controller('ProductsListCtrl', ['$scope', '$rootScope', '$http', 'paginator',
    'Products', '$log',
    function($scope, $rootScope, $http, paginator, Products, $log) {

      var firstPage = 1; // get the 1st page

      $scope.data = {
        records: []
      };

      // pagination
      $scope.pagination = {
        next: false,
        previous: false,
        page: 0,
        pageSize: 0,
        total: 0,
        numPages: 0
      };

      $scope.paginator = paginator;
//      paginator.setPage(firstPage)

      // fetch the records
      Products
        .get({
          page: firstPage
        })
        .$promise
        .then(function(response) {
          var body = response.result;
          $scope.data.records = body;
          // set the records
          paginator.setPage(response.page);
          paginator.setPrevious(response.page === 1);
          paginator.setNext(response.page === response.num_pages);
        });

      /**
       * Browse the previous page of records
       */
      $scope.previousPage = function() {
        // fetch the records
        Products
          .get({
            page: paginator.getPage() - 1
          })
          .$promise
          .then(function(response) {
            var body = response.result;
            $scope.data.records = body;

            // set the pager
            paginator.setPage(response.page);
            paginator.setPrevious(response.page === 1);
            paginator.setNext(response.page === response.num_pages);
          });
      };

      /**
       * Browse the next page of records
       */
      $scope.nextPage = function() {
        // fetch the pages
        Products
          .get({
            page: paginator.getPage() + 1
          })
          .$promise
          .then(function(response) {
            var body = response.result;
            $scope.data.records = body;
            // set the pager
            paginator.setPage(response.page);
            paginator.setPrevious(response.page === 1);
            paginator.setNext(response.page === response.num_pages);
          });
      };

      // listen to hide list updateD event
      var listUpdatedListener = $rootScope.$on('list_updated', function() {

        Products
          .get({
            page: firstPage
          })
          .$promise
          .then(function(response) {
            var body = response.result;
            $scope.data.records = body;

            // set the pager
            paginator.setPage(response.page);
            paginator.setPrevious(response.page === 1);
            paginator.setNext(response.page === response.num_pages);
          })
          .catch(function() {
            $log.error('failed to fetch records');
          });
      });

      // unregister the listener to avoid memory leak
      $scope.$on('$destroy', listUpdatedListener);

      $(window).trigger('resize');
    }
  ]);

angular.module('localBusinessApp')
  .controller('ProductsItemCtrl', ['$scope', '$log', 'modalDeleteItem', 'Products',
    'Media', '$state',
    function($scope, $log, modalDeleteItem, Products, Media, $state) {

      /**
       * Delete item from the list
       */
      $scope.deleteItem = function(record) {
        modalDeleteItem.open(function() {
          // Get the record and delete the image associated to it
          Products
            .get({
              id: record._id
            })
            .$promise
            .then(function(response) {
              $scope.record = response;

              if ($scope.record.media.length > 0) {
                var medias = [];
                for (var i = 0; i < $scope.record.media.length; i++) {
                  medias.push($scope.record.media[i]._id);
                }

                return Media.deleteList(medias);
              }

              return null;
            })
            .then(function() {
              return Products.delete({
                id: record._id
              });
            })
            .then(function() {
              // reload the list view
              $state.transitionTo('products', {}, {
                reload: true
              });
            })
            .catch(function(error) {
              $log.error('Failed to delete record', error);
            });
        });
      };
    }
  ]);

angular.module('localBusinessApp')
  .controller('ProductsAddFormCtrl', ['$scope', 'Products', 'Media',
    '$log', '$q', '$timeout', '$state', 'ImageUploader',
    function($scope, Products, Media, $log, $q, $timeout, $state,
      ImageUploader) {

      $scope.data = {
        // file: null,
        // filePath: '',
        // Keeps track of the images
        // that are uploaded while the form is still
        // dirty. These images should be serialized or deleted
        uploadedImages: [],
        // The model the controls are binded to.
        // Its fields are coresponding to our record fields
        model: {}
      };

      $scope.ui = {};
      $scope.ui.progress = 0;
      $scope.ui.inProgress = false;

      function progressStart() {
        $scope.ui.inProgress = true;
      }

      function progressEnd() {
        $scope.ui.inProgress = false;
      }

      /*
       * Listen on file select
       */
      $scope.onFileSelect = ImageUploader.onFileSelectForAdd($scope);

      /*
       * Delete temporary uploaded image
       */
      $scope.deleteImage = function(index) {
        console.log('Remove image at index: %i', index);
        $scope.data.uploadedImages.splice(index, 1);
        $scope.ui.progress = 0;
      };

      /*
       * Handle the add form submission
       */
      $scope.save = function() {
        // if the form is not valid then cut the flow
        if (!$scope.addForm.$valid) {
          return;
        }

        progressStart();

        function saveRecord(mediaIds) {
          var data = {
            title: $scope.data.model.title,
            body: $scope.data.model.body,
            price: $scope.data.model.price,
            url: $scope.data.model.url,
            media: mediaIds
          };

          Products
            .save(data)
            .$promise
            .then(function onSuccess() {

              // notify the listener when the record is added
              $scope.$emit('list_updated');

              // display the updated form
              $state.transitionTo($state.current, {}, {
                reload: true
              });
            })
            .catch(function onError() {
              $log.error('failed to add photo');
              progressEnd();
            });

        }

        function saveMedia() {
          var proms = [];

          for (var i in $scope.data.uploadedImages) {
            proms.push(Media.create($scope.data.uploadedImages[i]));
          }

          $q.all(proms)
            .then(function(values) {
              console.log(values);

              var mediaIds = [];
              for (var i in values) {
                mediaIds.push(values[i].data.result._id);
              }
              console.log('Media ids %o', mediaIds);
              saveRecord(mediaIds);
            });
        }

        // If a media is given and uploaded, save the media, get its id
        // and proceed with the save of record
        if ($scope.data.uploadedImages.length > 0) {
          saveMedia();
        } else {
          saveRecord([]);
        }

      };
    }
  ]);

angular.module('localBusinessApp')
  .controller('ProductsUpdateFormCtrl', [
    '$scope', '$rootScope', 'Products', '$log', '$q',
    '$stateParams', '$state', 'Media', 'ImageUploader',
    function($scope, $rootScope, Products, $log, $q, $stateParams,
      $state, Media, ImageUploader) {

      // When the user removes an image we are placing it in our thrash bin.
      // The content of this bin will be used during the from's save process.
      $scope.trashbin = [];

      $scope.data = {
        // Keeps track of the images
        // that are uploaded while the form is still
        // dirty. These images should be serialized or deleted
        uploadedImages: [],
        // The model the controls are binded to.
        // Its fields are coresponding to our record fields
        model: {}
      };

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

      // fetch single record
      Products
        .get({
          id: $stateParams.id
        })
        .$promise
        .then(function(response) {
          var body = response;
          $scope.data.model = body;
          $scope.ui.pictures = [];

          for (var i in $scope.data.model.media) {
            $scope.ui.pictures.push($scope.data.model.media[i].uri);
          }
        })
        .catch(function(response) {
          $log.error('failed to fetch record', response);
        });

      /**
       * Listen on file select
       */
      $scope.onFileSelect = ImageUploader.onFileSelectForUpdateMulti($scope);

      function deleteImage(index) {
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
      }

      /**
       * Delete the current image
       */
      $scope.deleteImage = function(index) {
        deleteImage(index);
      };

      /*
       * Handle the form submission
       */
      $scope.update = function() {
        // if the form is not valid then cut the flow
        if (!$scope.updateForm.$valid) {
          return;
        }

        progressStart();

        var toBeUpdateRecordId = $scope.data.model._id;

        function saveRecord(mediaIds) {

          // It could be other media already
          // associated to this record. We should merge them

          var totalMediaIDs = $scope.data.model.media.concat((mediaIds));

          /*
          var data = {
            title: $scope.data.model.title,
            body: $scope.data.model.body,
            price: $scope.data.model.price,
            url: $scope.data.model.url,
            media: totalMediaIDs
          };
          */

          $scope.data.model.media = totalMediaIDs;

          $scope.data.model.$save()
            .then(function onSuccess(response) {
              // notify the listener when the record is added
              $scope.$emit('list_updated');
              // display the updated form
              $state.transitionTo('products.details', {
                id: response._id
              }, {
                reload: true
              });
            })
            .catch(function onError(error) {
              $log.error('failed to save record', error);
              progressEnd();
            });
        }

        function saveMedia() {
          // Move the uploaded images in its final possition
          // and create the related database entry.

          var proms = [];

          for (var i in $scope.data.uploadedImages) {
            proms.push(Media.create($scope.data.uploadedImages[i]));
          }

          $q.all(proms)
            .then(function(values) {
              var mediaIds = [];
              for (var i in values) {
                mediaIds.push(values[i].data.result._id);
              }
              console.log('Media ids %o', mediaIds);
              saveRecord(mediaIds);
            });

        }

        // If a media is given and uploaded, save the media, get its id
        // and proceed with the save of record
        if ($scope.data.uploadedImages.length > 0) {
          saveMedia();
        } else {
          saveRecord([]);
        }

        // Clean up media placed in the trash bin
        function deleteMedia(id) {
          Media.delete(id).then(
            function onSuccess(response) {
              console.log(response);
            },

            function onError(response) {
              console.log(response);
            }
          );
        }

        for (var key in $scope.trashbin) {
          deleteMedia($scope.trashbin[key]);
        }
      };
    }
  ]);

angular.module('localBusinessApp')
  .controller('ProductsDetailsCtrl', ['$scope', '$stateParams', '$log',
    'Products',
    function($scope, $stateParams, $log, Products) {
      // hold the details data
      $scope.data = {
        model: {}
      };

      // fetch single record
      Products
        .get({
          id: $stateParams.id
        })
        .$promise
        .then(function(response) {
          var body = response;
          $scope.data.model = body;
          $scope.data.model.pictures = [];

          for (var i in $scope.data.model.media) {
            $scope.data.model.pictures.push($scope.data.model.media[i].uri);
          }
        });
    }
  ]);
