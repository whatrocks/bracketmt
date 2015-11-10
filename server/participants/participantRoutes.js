var ParticipantController = require('./ParticipantController.js');

module.exports = function(app) {

  app.route('/')
    .get(ParticipantController.allParticipants)
    .post(ParticipantController.newParticipant);

};
