'use strict';

/**
 * Uploads the media in a temporary folder in the server
 */
exports.create = function(req, res) {
  // uploader(req, res);
  return res.json(201, {
    result: req.files
  });
};

/**
 * TODO: We should define the function of the "show" end point
 */
exports.show = function(req, res) {
  return res.send(501, 'Request is not implemented.');
};

/**
 * TODO: We should define the function of the "destroy" end point
 */
exports.destroy = function(req, res) {
  return res.send(501, 'Request is not implemented.');
};

function handleError(res, err) {
  console.log(err);
  return res.send(500, err);
}
