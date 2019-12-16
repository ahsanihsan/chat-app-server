const { Expo } = require("expo-server-sdk");
let expo = new Expo();

const sendNotification = data => {
  let messages = [];
  if (!Expo.isExpoPushToken(data.expoToken)) {
    console.error(
      `Push token ${data.expoToken} is not a valid Expo push token`
    );
    return false;
  }

  messages.push({
    to: data.expoToken,
    sound: "default",
    body: data.body
    // data: { withSome: "data" }
  });

  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  (async () => {
    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error(error);
      }
    }
  })();
};

module.exports = sendNotification;
