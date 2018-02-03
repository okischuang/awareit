const History = require('./controllers/history')()
const Constants = require('./constants');
const Templates = require('./messages/templates');

var linebot = require('linebot');

var CHANNEL_ID = 1560850035;
var CHANNEL_SECRET = "863a7a3bc1a410b5f973db02e4180718";
var CHANNEL_ACCESS_TOKEN = "34+2fwcr+U0j47ibV8CJnZ9PPBZBm3sdFWTL2ovSk/RdMbowigDMExzmjbqv2PftotiYf5MFotkHbYIP3n+sGFezi1j7Yad6drGSYZ4cTE7iJQkvDHqkTYM31up7DMkq6HaYV0bmKv8g5n0348gBDQdB04t89/1O/w1cDnyilFU=";
var PORT = 8000;

var bot = linebot({
    channelId: CHANNEL_ID,
    channelSecret: CHANNEL_SECRET,
    channelAccessToken: CHANNEL_ACCESS_TOKEN,
});

const {
    ADD_NEW_THING,
    ADD_THING_PLACE,
    ADD_THING_TAGS,
    ADD_SUMMARY,
} = Constants.ACTION;


var keyword;

async function map_keyword_to_response(userId) {
    console.log("next keyword " + keyword);
    let response;
    switch(keyword) {
        case ADD_THING_PLACE:
            response = Templates(ADD_THING_PLACE);
            break;
        case ADD_THING_TAGS:
            response = Templates(ADD_THING_TAGS);
            break;
        case ADD_SUMMARY:
            let ret = await History.addHistory(userId)
            let hist = ret;
            let sum = {};
            sum.type = "text";
            sum.text = "Recorded: your " + hist.stuff_name + " is " + hist.stuff_position + " (" + hist.tags + ")";
            response = sum;
            break;
        default:
            return;
    }
    await bot.push(userId, response);
}

function handle_data(userId, data) {
    let action_data = {}
    action_data[Constants.ACTIONTOKEY[keyword]] = data
    History.updateAction(userId, keyword, action_data).then((ret) => {
        keyword = ret;
        map_keyword_to_response(userId);
    })
}

bot.on('postback', function (event) {
    handle_data(event.source.userId, event.postback.data);
});

bot.on('message', function (event) {
    console.log('Event:', JSON.stringify(event));

    let userId = event.source.userId;
    let message = event.message;

    if (userId) {
        if (message.text) {
        let response = '';
        let cmd = message.text.toLowerCase();

        switch(cmd) {
            case 'add new thing':
                response = Templates(ADD_NEW_THING);
                keyword = 'add_new_thing';
                break;
            case 'lost something':
            case 'settings':
                break;
            default:
                handle_data(userId, message.text);
        }

        bot.reply(event.replyToken, response).then(function (data) {
        }).catch(function (error) {
            console.log('Error: ' + JSON.stringify(error));
        });

        }
    }
});


bot.listen('/', PORT);

