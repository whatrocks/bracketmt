var userController = require('./userController.js');

module.exports = function(app) {

  app.post('/signin', userController.signin);
  app.post('/signup', userController.signup);
  // not sure if this one works
  app.get('/signedin', userController.checkAuth);

};
