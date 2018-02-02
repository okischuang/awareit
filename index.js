var linebot = require('linebot');
 
var CHANNEL_ID = null;
var CHANNEL_SECRET = "";
var CHANNEL_ACCESS_TOKEN = ""

var bot = linebot({
  channelId: CHANNEL_ID,
  channelSecret: CHANNEL_SECRET,
  channelAccessToken: CHANNEL_ACCESS_TOKEN,
});
 
bot.on('message', function (event) {
  console.log('Event:', JSON.stringify(event));
  let userId = event.source.userId;
  if (userId) {
    bot.push(userId, event.message.text).then(function (data) {
      // success
    }).catch(function (error) {
      console.log('Error: ' + JSON.stringify(error));
    });
  }
});
 
bot.listen('/', 3000);