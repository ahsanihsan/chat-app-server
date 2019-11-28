const Boom = require("@hapi/boom");
const Conversation = require("../models//Conversation");

module.exports = async function(request, reply) {
  let promise = new Promise(async resolve => {
    await Conversation.findById(request.params.conversationId)
      .populate("messages")
      .then(conversation => {
        if (conversation) {
          resolve({ id: conversation._id, messages: conversation.messages });
        } else {
          resolve(Boom.notFound("Cannot find conversations"));
        }
      });
  });
  return promise;
};
