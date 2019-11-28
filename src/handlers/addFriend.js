const Boom = require("@hapi/boom");
const User = require("../models/User");

const addFriend = async function(request, res) {
  let promise = new Promise(async resolve => {
    if (request.auth.credentials.email !== request.payload.email) {
      await User.findOne({ email: request.auth.credentials.email }).then(
        user => {
          if (user) {
            User.findOne({ email: request.payload.email }).then(friend => {
              if (friend) {
                const stringId = `${friend._id}`;
                const friendExists =
                  user.friends.filter(f => `${f}` === stringId).length > 0;
                if (!friendExists) {
                  user.friends.push(friend);
                  user.save();
                  resolve({
                    friend: { fullName: friend.fullName, _id: friend._id }
                  });
                } else {
                  resolve(Boom.conflict("You have added already this friend"));
                }
              } else {
                resolve(
                  Boom.notFound(`Friend ${request.payload.email} doesn't exist`)
                );
              }
            });
          } else {
            resolve(Boom.notFound("Cannot find user"));
          }
        }
      );
    } else {
      resolve(Boom.conflict("Cannot add yourself as a friend"));
    }
  });
  return promise;
};

module.exports = addFriend;
