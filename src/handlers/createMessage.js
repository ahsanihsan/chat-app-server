const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

const createMessage = request => {
  let promise = new Promise(resolve => {
    console.log(request);
    Conversation.findById(request.conversationId).then(conversation => {
      const textMessage = new Message({
        text: request.text,
        userId: "ahsan.ihsan@outlook.com"
      });
      textMessage
        .save()
        .then(savedMessage => {
          conversation.messages.push(savedMessage);
          conversation.save();
          resolve({ success: true, message: "Message saved" });
        })
        .catch(error => {
          resolve({ success: false, message: error });
        });
    });
  });
  return promise;
};

module.exports = createMessage;
