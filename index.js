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
  let message = event.message;
  if (userId) {

    if (message.text) {
      let response = message.text;
      let cmd = message.text.toLowerCase();
      switch(cmd) {
        case 'hi':
          response = confirmDialog;
          break;
        case 'time':
          response = datePicker;
          break;
      }
      bot.reply(event.replyToken, response).then(function (data) {
        // success
      }).catch(function (error) {
        console.log('Error: ' + JSON.stringify(error));
      });
    }
  }
});

bot.on('postback', function (event) {

  console.log('Event:', JSON.stringify(event));

});

let confirmDialog = {
  "type": "template",
  "altText": "this is a confirm template",
  "template": {
      "type": "confirm",
      "text": "根據我們的觀察 鑰匙是最常不見物品 請問要追蹤鑰匙嗎？",
      "actions": [
          {
            "type": "message",
            "label": "好喔",
            "text": "yes"
          },
          {
            "type": "message",
            "label": "不要",
            "text": "no"
          }
      ]
  }
};

let datePicker = {  
  "type":"datetimepicker",
  "label":"請設定提醒時間",
  "data":"storeId=12345",
  "mode":"time",
  "initial":"00:00",
  "max":"23:59",
  "min":"00:00"
};

bot.listen('/', 3000);