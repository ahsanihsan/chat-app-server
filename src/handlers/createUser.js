const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const User = require("../models/User");
const Boom = require("@hapi/boom");

const sanitizeUser = require("../helpers/sanitizeUser");
const config = require("../../config/config");

const secret = config.jwt.secret;
const expiresIn = config.jwt.expiresIn;

const getHashedPassword = password => {
  const saltRounds = 10;
  const hash = bcrypt.hashSync(password, saltRounds);
  return hash;
};

const createUser = async (request, reply) => {
  let newUser = new Promise(resolve => {
    User.findOne({ email: request.payload.email }).then(user => {
      if (!user) {
        const hashedPassword = getHashedPassword(request.payload.password);
        newUser = new User({
          fullName: request.payload.fullName,
          email: request.payload.email,
          password: hashedPassword
        });
        newUser.save(err => {
          console.log(err);
        });
        const token = JWT.sign({ email: newUser.email }, secret, { expiresIn });
        resolve({ success: true, token, user: sanitizeUser(newUser) });
      } else {
        resolve({ success: false, message: "User already exists" });
      }
    });
  });
  return newUser;
};

module.exports = createUser;
