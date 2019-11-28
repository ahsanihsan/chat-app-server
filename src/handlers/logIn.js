const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const User = require("../models/User");
const Boom = require("@hapi/boom");

const sanitizeUser = require("../helpers/sanitizeUser");
const config = require("../../config/config");

const secret = config.jwt.secret;
const expiresIn = config.jwt.expiresIn;

module.exports = async function logIn(
  { headers, payload: { email, password } },
  reply
) {
  let promise = new Promise(resolve => {
    User.findOne({ email }).then(user => {
      if (!user) {
        resolve(Boom.notFound("Wrong email or password"));
      }

      const passwordMatch = bcrypt.compareSync(password, user.password);
      if (!passwordMatch) {
        resolve(Boom.unauthorized("Wrong email or password"));
      }

      const token = JWT.sign({ email: user.email }, secret, { expiresIn });
      resolve({ token, user: sanitizeUser(user) });
    });
  });
  return promise;
};
