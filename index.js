const History = require('./controllers/history')()

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

const kw_to_key = {
    'add_new_thing': 'stuff_name',
    'add_thing_place': 'stuff_position',
    'add_thing_tags': 'tags'
}


var keyword;

async function map_keyword_to_response(userId) {
    console.log("next keyword " + keyword);
    let response;
    switch(keyword) {
        case 'add_thing_place':
            response = addThingPlace;
            break;
        case 'add_thing_tags':
            response = addThingTags;
            break;
        case 'add_summary':
            let ret = await History.addHistory(userId)
            let hist = ret;
            let sum = {};
            sum.type = "text";
            sum.text = "Your " + hist.stuff_name + " is " + hist.stuff_position + " (" + hist.tags + ")";
            response = sum;
            break;
        default:
            return;
    }
    await bot.push(userId, response);
}

function handle_data(userId, data) {
    let action_data = {}
    action_data[kw_to_key[keyword]] = data
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
                response = addNewThing;
                keyword = 'add_new_thing';
                break;
            case 'edit things':
                response = editThings;
                keyword = 'pick_thing';
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


let addNewThing = {
    "type": "template",
    "altText": "This is a buttons template",
    "template": {
        "type": "buttons",
        "title": "What do you want to add?",
        "text": "Please select one, or enter your thing's name:",
        "actions": [
        {
            "type": "postback",
            "label": "Keys",
            "data": "keys"
        },
        {
            "type": "postback",
            "label": "Wallet",
            "data": "wallet"
        },
        {
            "type": "postback",
            "label": "Glasses",
            "data": "glasses"
        },
        {
            "type": "postback",
            "label": "Umbrella",
            "data": "umbrella" // to places
        }
        ]
    }
};

let addThingPlace = {
    "type": "template",
    "altText": "This is a buttons template",
    "template": {
        "type": "buttons",
        "title": "Where is it now?",
        "text": "Please select one, or enter where it is:",
        "actions": [
        {
            "type": "postback",
            "label": "In my pocket",
            "data": "in pocket"
        },
        {
            "type": "postback",
            "label": "In my bag",
            "data": "in bag"
        },
        {
            "type": "postback",
            "label": "On my desk", // to tags
            "data": "on desk"
        }
        ]
    }
};

let addThingTags = {
    "type": "template",
    "altText": "This is a buttons template",
    "template": {
        "type": "buttons",
        "title": "Add hashtags?",
        "text": "This can help you remember more about your thing's status:",
        "actions": [
        {
            "type": "postback",
            "label": "Skip", // to summary
            "data": "none"
        }
        ]
    }
};


let editThings = {


}

bot.listen('/', PORT);

