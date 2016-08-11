/**
 * Module dependencies.
 */
var passport = require('passport-strategy'),
  util = require('util'),
  lookup = require('./utils').lookup;


/**
 * `Strategy` constructor.
 *
 * The local authentication strategy authenticates requests based on the
 * credentials submitted through an HTML-based login form.
 *
 * Clientlications must supply a `verify` callback which accepts `username` and
 * `password` credentials, and then calls the `done` callback supplying a
 * `user`, which should be set to `false` if the credentials are not valid.
 * If an exception occured, `err` should be set.
 *
 * Optionally, `options` can be used to change the fields in which the
 * credentials are found.
 *
 * Options:
 *   - `clientId`  field name where the client identifier is found, defaults to _clientId_
 *   - `clientSecret`  field name where the password is found, defaults to _clientSecret_
 *   - `passReqToCallback`  when `true`, `req` is the first argument to the verify callback (default: `false`)
 *
 * Examples:
 *
 * passport.use(new ClientStrategy({
 *  clientId: 'clientId',
 *  clientSecret: 'clientSecret' // this is the virtual field on the model
 * },
 * function(clientId, clientSecret, done) {
 *  Client.findOne({
 *    clientId: clientId
 *  }, function(err, client) {
 *    return done(null, client);
 *  });
 * }
));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  if (typeof options === 'function') {
    verify = options;
    options = {};
  }
  if (!verify) {
    throw new TypeError('ClientStrategy requires a verify callback');
  }

  this._clientId = options.clientId || 'clientId';
  this._clientSecret = options.clientSecret || 'clientSecret';

  passport.Strategy.call(this);
  this.name = 'client-strategy';
  this._verify = verify;
  this._passReqToCallback = options.passReqToCallback;
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);

/**
 * Authenticate request based on the contents of a form submission.
 *
 * @param {Object} req
 * @api protected
 */
Strategy.prototype.authenticate = function(req, options) {
  options = options || {};
  var clientId = req.query.client_id || null;
  var clientSecret = req.query.client_secret || null;

  if (!clientId || !clientSecret) {
    return this.fail({
      message: options.badRequestMessage || 'Missing credentials: Required query parameters: {{client_id}}, {{client_secret}}'
    }, 400);
  }

  var self = this;

  function verified(err, client, info) {
    if (err) {
      return self.error(err);
    }
    if (!client) {
      return self.fail(info);
    }
    self.success(client, info);
  }

  try {
    if (self._passReqToCallback) {
      this._verify(req, clientId, clientSecret, verified);
    } else {
      this._verify(clientId, clientSecret, verified);
    }
  } catch (ex) {
    return self.error(ex);
  }
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
