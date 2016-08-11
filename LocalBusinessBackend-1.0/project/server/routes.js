/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/products', require('./api/product'));
  app.use('/api/reviews', require('./api/review'));
  app.use('/api/accounts', require('./api/account'));
  app.use('/api/pages', require('./api/page'));
  app.use('/api/articles', require('./api/article'));
  app.use('/api/users', require('./api/user'));
  app.use('/api/uploads', require('./api/upload'));
  app.use('/api/media', require('./api/media'));
  app.use('/api/clients', require('./api/client'));
  app.use('/api/galleries', require('./api/gallery'));
  app.use('/api/services', require('./api/service'));
  app.use('/api/catalogs', require('./api/catalog'));

  // Public API
  app.use('/public/business', require('./api/account'));

  app.use('/auth', require('./auth'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
    .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
