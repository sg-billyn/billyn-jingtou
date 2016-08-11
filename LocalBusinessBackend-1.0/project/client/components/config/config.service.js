'use strict';

angular.module('localBusinessApp').constant('API', {
  url: '',
  endpoint: {
    articles: '/api/articles/',
    offers: '/api/offers/',
    pages: '/api/pages/',
    media: '/api/media/',
    accounts: '/api/accounts/',
    reviews: '/api/reviews/',
    clients: '/api/clients/',
    products: '/api/products/',
    galleries: '/api/galleries/',
    services: '/api/services/',
    catalogs: '/api/catalogs/'
  }
});
