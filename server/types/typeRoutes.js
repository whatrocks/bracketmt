var typeController = require('./typeController.js');

module.exports = function(app) {

  app.get('/types', typeController.types);

};
