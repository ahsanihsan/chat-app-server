const Boom = require("@hapi/boom");
const User = require("../models/User");
const Conversation = require("../models/Conversation");

module.exports = async function(request, reply) {
  let promise = new Promise(async resolve => {
    await User.findOne({ email: request.auth.credentials.email })
      .populate("conversations")
      .then(user => {
        if (user) {
          const isConversationExist =
            user.conversations.filter(
              conversation =>
                conversation.userOneId === request.payload.friendId ||
                conversation.userTwoId === request.payload.friendId
            ).length > 0;
          if (isConversationExist) {
            resolve(
              Boom.badData("You already have conversation with this user")
            );
          } else {
            User.findById(request.payload.friendId).then(friend => {
              const newConversation = new Conversation({
                userOneId: user._id,
                userTwoId: friend._id
              });
              newConversation.save().then(conversation => {
                user.conversations.push(conversation);
                user.save();
                friend.conversations.push(conversation);
                friend.save();

                resolve({ id: conversation._id, friendId: friend._id });
              });
            });
          }
        } else {
          resolve(Boom.notFound("Cannot find user"));
        }
      });
  });
  return promise;
};
