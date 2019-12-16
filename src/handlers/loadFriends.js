const Boom = require("@hapi/boom");
const User = require("../models/User");

module.exports = async function(request, reply) {
  let promise = new Promise(async resolve => {
    // await User.findOne({ email: request.auth.credentials.email })
    //   .populate("friends")
    //   .then(user => {
    //     if (user) {
    //       const mappedFriends = [];
    //       user.friends.forEach(friend => {
    //         mappedFriends.push({
    //           _id: friend._id,
    //           email: friend.email,
    //           name: friend.fullName
    //         });
    //       });
    //       resolve({ success: true, message: mappedFriends });
    //     } else {
    //       resolve(Boom.notFound("Cannot find user"));
    //     }
    // });
    await User.find({ userType: request.params.userType })
      .then(user => {
        resolve({ success: true, message: user });
      })
      .catch(error => {
        resolve({
          success: false,
          message: "There was an error fetching users, please try again later"
        });
      });
  });
  return promise;
};
