'use strict'

const Reminder = require('./controllers/reminder')()
var linebot = require('linebot')
const config = require('./config.dev')
const CHANNEL_ID = config.config.CHANNEL_ID
const CHANNEL_SECRET = config.config.CHANNEL_SECRET
const CHANNEL_ACCESS_TOKEN = config.config.CHANNEL_ACCESS_TOKEN

var bot = linebot({
  channelId: CHANNEL_ID,
  channelSecret: CHANNEL_SECRET,
  channelAccessToken: CHANNEL_ACCESS_TOKEN
})

async function checkReminder () {
  console.log('Polling data every 1 sec...')
  let reminderList = await Reminder.getAllReminder()
  console.log(reminderList)
  reminderList.forEach(async (r) => {
    let msg = 'Is Your ' + r.name + ' still in the ' + r.stuff_position + ' \xF0\x9F\x98\x9D?'
    await bot.push(r.uid, {
      type: 'text',
      text: msg
    })
  })
}

async function main () {
  setInterval(checkReminder, 1000)
}

main()
