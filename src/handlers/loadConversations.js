const Boom = require("@hapi/boom");
const User = require("../models/User");

module.exports = async function(request, reply) {
  let promise = new Promise(async resolve => {
    await User.findOne({ email: request.auth.credentials.email })
      .populate("conversations")
      .then(user => {
        if (user) {
          const conversations = user.conversations.map(conversation => {
            const friendId =
              `${user._id}` === conversation.userOneId
                ? conversation.userTwoId
                : conversation.userOneId;
            return {
              id: conversation._id,
              friendId
            };
          });
          resolve({ success: true, message: conversations });
        } else {
          resolve(Boom.notFound("Cannot find user"));
        }
      });
  });
  return promise;
};
