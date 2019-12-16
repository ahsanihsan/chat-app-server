const User = require("../models/User");

const getProfile = async (request, reply) => {
  let currentUser = new Promise(resolve => {
    User.findOne({ email: request.auth.credentials.email }).then(user => {
      if (!user) {
        resolve({ success: false, message: "No User found" });
      } else {
        resolve({ success: true, message: user });
      }
    });
  });
  return currentUser;
};

module.exports = getProfile;
