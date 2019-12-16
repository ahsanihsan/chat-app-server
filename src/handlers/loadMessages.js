const Boom = require("@hapi/boom");
const Conversation = require("../models//Conversation");

module.exports = async function(request, reply) {
  let promise = new Promise(async resolve => {
    await Conversation.findById(request.params.conversationId)
      .populate("messages")
      .then(conversation => {
        if (conversation) {
          resolve({ success: true, message: conversation });
        } else {
          resolve(Boom.notFound("Cannot find conversations"));
        }
      });
  });
  return promise;
};
