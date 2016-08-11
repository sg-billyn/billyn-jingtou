'use strict';

angular.module('localBusinessApp')
  .factory('paginator', function() {

    var pagination = {
      next: false,
      previous: false,
      page: 0,
      pageSize: 0,
      total: 0,
      numPages: 0
    };

    // Public API here
    return {
      setNext: function(next) {
        pagination.next = next;
      },
      next: function() {
        return pagination.next;
      },
      setPrevious: function(previous) {
        pagination.previous = previous;
      },
      previous: function() {
        return pagination.previous;
      },
      setPage: function(page) {
        pagination.page = page;
      },
      getPage: function() {
        return pagination.page;
      },
      setPages: function(pages) {
        pagination.numPages = pages;
      },
      getPages: function() {
        return pagination.numPages;
      }
    };
  });
