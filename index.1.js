const linebot = require('linebot')
const Stuff = require('./controllers/stuff')()
const History = require('./controllers/history')()
const CHANNEL_ID = '1560850616'
const CHANNEL_SECRET = '66373756b6dff76402df4334744e1d6c'
const CHANNEL_ACCESS_TOKEN = 'HRVQgcYLclHFeUpiDeWqtbpx05vbPUky0B/4LhowCjgq3RQTTKavmi2jdX6HhsUx6wYLxxpnmgR/jOXFLFHkKwRKh1OHXU9rPAcMttp+LDradQDNeqFjwfFPv6qgaCW6DawPhg1RqZIqqu8/ODCq1AdB04t89/1O/w1cDnyilFU='

const bot = linebot({
  channelId: CHANNEL_ID,
  channelSecret: CHANNEL_SECRET,
  channelAccessToken: CHANNEL_ACCESS_TOKEN
})

bot.on('message', function (event) {
  console.log('Event:', JSON.stringify(event))

  let userId = event.source.userId
  let message = event.message
  if (userId) {
    if (message.text) {
      let response = message.text
      let cmd = message.text.toLowerCase()
      switch (cmd) {
        case 'getstuff':
          console.log('==getStuff==')
          let stuffList = Stuff.getUserStuff(userId)
          response = {
            'type': 'text',
            'text': stuffList
          }
          break
        case 'hi':
          History.updateAction(userId, 'add_thing_place', {stuff_postition: 'bag'})
          History.addHistory(userId).then((h) => {
            console.log(h)
          })
         
          response = confirmDialog
          break
        case 'time':
          response = datePicker
          break
      }
      bot.reply(event.replyToken, response).then(function (data) {
        // success
      }).catch(function (error) {
        console.log('Error: ' + JSON.stringify(error))
      })
    }
  }
})

bot.on('postback', function (event) {
  console.log('Event:', JSON.stringify(event))
})

let confirmDialog = {
  'type': 'template',
  'altText': 'this is a confirm template',
  'template': {
    'type': 'confirm',
    'text': '根據我們的觀察 鑰匙是最常不見物品 請問要追蹤鑰匙嗎？',
    'actions': [
      {
        'type': 'message',
        'label': '好喔',
        'text': 'yes'
      },
      {
        'type': 'message',
        'label': '不要',
        'text': 'no'
      }
    ]
  }
}

let showStuffDialog = {
  'type': 'template',
  'altText': 'Show all stuff',
  'template': {
    'type': 'confirm',
    'text': '根據我們的觀察 鑰匙是最常不見物品 請問要追蹤鑰匙嗎？',
    'actions': [
      {
        'type': 'message',
        'label': 'show',
        'text': 'yes'
      },
      {
        'type': 'message',
        'label': 'end',
        'text': 'no'
      }
    ]
  }
}

let datePicker = {
  'type': 'datetimepicker',
  'label': '請設定提醒時間',
  'data': 'storeId=12345',
  'mode': 'time',
  'initial': '00:00',
  'max': '23:59',
  'min': '00:00'
}

bot.listen('/', 8000)
