const Boom = require("@hapi/boom");
const User = require("../models/User");

module.exports = async function(request, reply) {
  let promise = new Promise(async resolve => {
    await User.findOne({ email: request.auth.credentials.email })
      .populate("friends")
      .then(user => {
        if (user) {
          const mappedFriends = {};
          user.friends.forEach(friend => {
            mappedFriends[friend._id] = {
              _id: friend._id,
              email: friend.email,
              name: friend.fullName
            };
          });
          resolve(mappedFriends);
        } else {
          resolve(Boom.notFound("Cannot find user"));
        }
      });
  });
  return promise;
};
