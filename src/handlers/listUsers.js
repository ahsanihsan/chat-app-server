const Boom = require("@hapi/boom");
const User = require("../models/User");

module.exports = async function(request, reply) {
  let promise = new Promise(async resolve => {
    await User.find()
      .populate("friends")
      .then(user => {
        if (user) {
          let users = [];
          user.map(mainUser => {
            if (mainUser.email !== request.auth.credentials.email) {
              if (users.friends && users.friends.length > 0) {
                users.friends.map(item => {
                  if (item.email !== request.auth.credentials.email) {
                    users.push({
                      id: mainUser._id,
                      name: mainUser.fullName,
                      email: mainUser.email
                    });
                  }
                });
              } else {
                users.push({
                  id: mainUser._id,
                  name: mainUser.fullName,
                  email: mainUser.email
                });
              }
            }
          });
          resolve({ success: true, message: users });
        } else {
          resolve(Boom.notFound("Cannot find user"));
        }
      });
  });
  return promise;
};
