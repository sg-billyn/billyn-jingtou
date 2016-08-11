'use strict';

angular.module('localBusinessApp')
  .controller('PagesListCtrl', ['$scope', '$rootScope', '$http', 'paginator', 'Pages',
    function($scope, $rootScope, $http, paginator, Pages) {

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

      // fetch the pages
      Pages.get(firstPage).then(function(response) {
        var body = response.data;
        $scope.data.records = body.result;

        // set the pager
        paginator.setPage(body.page);
        paginator.setPrevious(body.page === 1);
        paginator.setNext(body.page === body.num_pages);
      });

      /**
       * Browse the previous page of pages
       */
      $scope.previousPage = function() {
        // fetch the pages
        Pages.get(paginator.getPage() - 1).then(function(response) {
          var body = response.data;
          $scope.data.records = body.result;

          // set the pager
          paginator.setPage(body.page);
          paginator.setPrevious(body.page === 1);
          paginator.setNext(body.page === body.num_pages);
        });
      };

      /**
       * Browse the next page of pages
       */
      $scope.nextPage = function() {

        // fetch the pages
        Pages.get(paginator.getPage() + 1).then(function(response) {
          var body = response.data;
          $scope.data.records = body.result;

          // set the pager
          paginator.setPage(body.page);
          paginator.setPrevious(body.page === 1);
          paginator.setNext(body.page === body.num_pages);
        });
      };

      // listen to hide pages list update event
      var listUpdatedListener = $rootScope.$on('list_updated', function() {

        Pages.get(firstPage).then(function(response) {
          var body = response.data;
          $scope.data.records = body.result;

          // set the pager
          paginator.setPage(body.page);
          paginator.setPrevious(body.page === 1);
          paginator.setNext(body.page === body.num_pages);
        });

      });

      // unregister the listener to avoid memory leak
      $scope.$on('$destroy', listUpdatedListener);

      $(window).trigger('resize');
    }
  ]);

angular.module('localBusinessApp')
  .controller('PagesItemCtrl', ['$scope', '$log', 'modalDeleteItem', 'Pages',
    'Media', '$state',
    function($scope, $log, modalDeleteItem, Pages, Media, $state) {

      /**
       * Delete page item from the list
       */
      $scope.deletePage = function(page) {
        modalDeleteItem.open(function() {
          // Get the page and delete the image associated to it
          Pages.findOne(page._id)
            .then(function(response) {
              var body = response.data;
              $scope.record = body.result;

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
              return Pages.delete(page._id);
            })
            .then(function onSuccess() {
              // reload the pages list view
              $state.transitionTo('pages', {}, {
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
  .controller('PagesAddFormCtrl', ['$scope', 'Pages', 'Media',
    '$log', '$q', '$timeout', '$state', 'ImageUploader',
    function($scope, Pages, Media, $log, $q, $timeout, $state,
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
       * Handle the add page form submission
       */
      $scope.save = function() {
        // if the form is not valid then cut the flow
        if (!$scope.addForm.$valid) {
          return;
        }

        progressStart();

        function savePage(mediaIds) {
            var data = {
              title: $scope.data.model.title,
              teaser: $scope.data.model.teaser,
              body: $scope.data.model.body,
              media: mediaIds
            };

            Pages.create(data).then(function onSuccess() {

              // notify the listener when the page is added
              $scope.$emit('list_updated');

              // display the updated form
              $state.transitionTo($state.current, {}, {
                reload: true
              });
            }, function onError() {
              $log.error('failed to add photo');
              progressEnd();
            });

          } // savePage()

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
              savePage(mediaIds);
            });
        }

        // If a media is given and uploaded, save the media, get its id
        // and proceed with the save of page
        if ($scope.data.uploadedImages.length > 0) {
          saveMedia();
        } else {
          savePage([]);
        }

      };


      //
      // http://jsfiddle.net/ThomasBurleson/QqKuk/
      // https://thinkster.io/egghead/promises/
      //
      /*
      var defers = [],
          proms  = [];

      defers.push($q.defer());
      defers.push($q.defer());

      proms.push(defers[0].promise.then(function () {
        alert('I promised I would show up - 1');
        return 1;
      }));

      proms.push(defers[1].promise.then(function () {
        alert('I promised I would show up - 2');
        return 2;
      }));

      $q.all(proms)
      .then(function(values) {
        console.log(values);
        return values;
      });

      $scope.rundefer = function(){
        console.log('resolving delayed promises');
        defers[0].resolve();
        defers[1].resolve();
      }
      */
    }
  ]);

angular.module('localBusinessApp')
  .controller('PagesUpdateFormCtrl', [
    '$scope', '$rootScope', 'Pages', '$log', '$q',
    '$stateParams', '$state', 'Media', 'ImageUploader',
    function($scope, $rootScope, Pages, $log, $q, $stateParams,
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

      // fetch single page
      Pages.findOne($stateParams.id).then(function(response) {
        var body = response.data;
        $scope.data.model = body.result;
        $scope.ui.pictures = [];

        for (var i in $scope.data.model.media) {
          $scope.ui.pictures.push($scope.data.model.media[i].uri);
        }

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

        var toBeUpdatePageId = $scope.data.model._id;

        function savePage(mediaIds) {

            // It could be other media allready
            // associated to this page. We should merge them

            var totalMediaIDs = $scope.data.model.media.concat((mediaIds));

            var data = {
              title: $scope.data.model.title,
              teaser: $scope.data.model.teaser,
              body: $scope.data.model.body,
              media: totalMediaIDs
            };

            Pages.update($scope.data.model._id, data).then(function onSuccess() {
              // notify the listener when the page is added
              $rootScope.$emit('list_updated');
              // display the updated form
              $state.transitionTo('pages.details', {
                id: toBeUpdatePageId
              });
            }, function onError(response) {
              $log.error('response', response);
            });

          } // savePage()

        function saveMedia() {
            // Move the uploaded images in its final possition
            // and create the related database entry.

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
                savePage(mediaIds);
              });

          } // saveMedia()

        // If a media is given and uploaded, save the media, get its id
        // and proceed with the save of page
        if ($scope.data.uploadedImages.length > 0) {
          saveMedia();
        } else {
          savePage([]);
        }


        // Clean up media placed in the trash bin
        function deleteMedia(id) {
          Media.delete(id).then(
            function onSuccess(responce) {
              console.log(responce);
            },

            function onError(responce) {
              console.log(responce);
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
  .controller('PagesDetailsCtrl', ['$scope', '$stateParams', '$log',
    'Pages',
    function($scope, $stateParams, $log, Pages) {
      // hold the details data
      $scope.data = {
        model: {}
      };

      // fetch single page
      Pages.findOne($stateParams.id).then(function(response) {
        var body = response.data;
        $scope.data.model = body.result;
        $scope.data.model.pictures = [];

        for (var i in $scope.data.model.media) {

          $scope.data.model.pictures.push($scope.data.model.media[i].uri);
        }

      });
    }
  ]);
