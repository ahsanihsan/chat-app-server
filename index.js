const hapiAuthJwt2 = require("hapi-auth-jwt2");
const handlers = require("./src/handlers");
const User = require("./src/models/User");

const Hapi = require("@hapi/hapi");
const mongoose = require("mongoose");
const config = require("./config/config");
const Joi = require("@hapi/joi");

const server = new Hapi.Server(config.server);

const sockets = {};

// server.connection(config.server);

const socketio = require("socket.io")(server.listener, {
  pingTimeout: 5000
});

socketio.on("connection", socket => {
  socket.on("init", userId => {
    sockets[userId.senderId] = socket;
  });
  socket.on("message", message => {
    if (sockets[message.receiverId]) {
      sockets[message.receiverId].emit("message", message);
    }
    handlers.createMessage(message);
  });
  socket.on("disconnect", userId => {
    delete sockets[userId.senderId];
  });
});

mongoose.connect(config.database);

const validate = async decoded => {
  let promise = await new Promise(async resolve => {
    await User.findOne({ email: decoded.email }).then(user => {
      if (!user) {
        resolve({ isValid: false });
      }
      resolve({ isValid: true });
    });
  });
  return promise;
};

const start = async () => {
  await server.register(hapiAuthJwt2);

  server.auth.strategy("jwt", "jwt", {
    key: config.jwt.secret,
    validate: validate,
    verifyOptions: {
      algorithms: ["HS256"]
    }
  });
  server.route({
    method: "POST",
    path: "/register",
    handler: handlers.createUser,
    config: {
      auth: false,
      validate: {
        payload: Joi.object({
          fullName: Joi.string().required(),
          email: Joi.string().required(),
          password: Joi.string().required()
        })
      }
    }
  });
  server.route({
    method: "POST",
    path: "/login",
    handler: handlers.logIn,
    config: {
      auth: false,
      validate: {
        payload: Joi.object({
          email: Joi.string().required(),
          password: Joi.string().required()
        })
      }
    }
  });
  server.route({
    method: "POST",
    path: "/friends",
    handler: handlers.addFriend,
    config: {
      auth: "jwt",
      validate: {
        payload: Joi.object({
          email: Joi.string().required()
        })
      }
    }
  });
  server.route({
    method: "GET",
    path: "/friends",
    handler: handlers.loadFriends,
    config: {
      auth: "jwt"
    }
  });
  server.route({
    method: "GET",
    path: "/conversations",
    handler: handlers.loadConversations,
    config: {
      auth: "jwt"
    }
  });
  server.route({
    method: "POST",
    path: "/conversations",
    handler: handlers.createConversation,
    config: {
      auth: "jwt",
      validate: {
        payload: Joi.object({
          friendId: Joi.string().required()
        })
      }
    }
  });
  server.route({
    method: "GET",
    path: "/messages/{conversationId}",
    handler: handlers.loadMessages,
    config: {
      auth: "jwt"
    }
  });
  server.route({
    method: "POST",
    path: "/messages",
    handler: handlers.createMessage,
    config: {
      auth: "jwt"
    }
  });
  server.auth.default("jwt");

  await server.start(err => {
    if (err) {
      console.log("************** SERVER INFO **********");
      console.log(err);
      console.log("************** SERVER INFO **********");
      throw err;
    }

    console.log("************** SERVER INFO **********");
    console.log(`Server running at: ${server.info.uri}`);
    console.log("************** SERVER INFO **********");
  });
};

start();
