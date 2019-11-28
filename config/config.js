module.exports = {
  database: "mongodb://localhost:27017/message_app",
  server: {
    port: 8888,
    host: "localhost"
  },
  jwt: {
    secret: "ahsan11343",
    expiresIn: "1d"
  }
};
