var passport = require('passport'),
  ClientStrategy = require('./../../components/custom-client-strategy').Strategy;

exports.setup = function(Client, config) {
  passport.use(new ClientStrategy({
      clientId: 'clientId',
      clientSecret: 'clientSecret' // this is the virtual field on the model
    },
    function(clientId, clientSecret, done) {
      Client.findOne({
        clientId: clientId
      })
      .populate({
        path: 'createdBy',
        select: ' -email -role -hashedPassword -salt -provider -__v',
        options: {
          weight: 1
        }
      })
      .exec(function(err, client) {
        if (err) return done(err);

        if (!client) {
          return done(null, false, {
            message: 'This client identifier is not registered.'
          });
        }
        if (!client.authenticate(clientSecret)) {
          return done(null, false, {
            message: 'This client secret is not correct.'
          });
        }
        return done(null, client);
      });
    }
  ));
};
