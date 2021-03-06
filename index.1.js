const linebot = require('linebot')
const Stuff = require('./controllers/stuff')()
const History = require('./controllers/history')()
const Reminder = require('./controllers/reminder')()
const config = require('./config.dev')
const CHANNEL_ID = config.config.CHANNEL_ID
const CHANNEL_SECRET = config.config.CHANNEL_SECRET
const CHANNEL_ACCESS_TOKEN = config.config.CHANNEL_ACCESS_TOKEN

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
        case 'allreminder':
          Reminder.getAllReminder()
          break
        case 'allhistory':
          History.getAllHistory(userId)
          break
        case 'stuffhistory':
          History.getStuffHistory(userId, 13)
          break
        case 'addreminder':
          Reminder.addReminder(userId, 13, [new Date(), new Date()])
          break
        case 'getstuff':
          console.log('==getStuff==')
          let stuffList = Stuff.getUserStuff(userId)
          response = {
            'type': 'text',
            'text': stuffList
          }
          break
        case 'update':
          History.updateAction(userId, 'add_thing_place', {stuff_postition: 'bag', schedules: [new Date(), new Date()]})
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
