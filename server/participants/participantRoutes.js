var ParticipantController = require('./participantController.js');

module.exports = function(app) {

  app.route('/')
    .get(ParticipantController.allParticipants)
    .post(ParticipantController.newParticipant);

};
