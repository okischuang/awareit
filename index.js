const History = require('./controllers/history')()
const Stuff = require('./controllers/stuff')()
const Constants = require('./constants');
const Templates = require('./messages/templates');

var linebot = require('linebot');

var bot = linebot({
    channelId: Constants.CHANNEL_ID,
    channelSecret: Constants.CHANNEL_SECRET,
    channelAccessToken: Constants.CHANNEL_ACCESS_TOKEN,
});

const {
    ADD_NEW_THING,
    ADD_THING_PLACE,
    ADD_THING_TAGS,
    ADD_SUMMARY,
    PICK_THING,
    PICK_THING_HIST,
    UPDATE_OPTIONS,
    UPDATE_RECORD_OPTION,
    UPDATE_ALERT_OPTION,
    ALERT_OPTIONS,
    ALERT_LIST_OPTION,
    ALERT_ADD_OPTION,
    LIST_HISTORY
} = Constants.ACTION;


var keyword;

function handle_data(userId, data) {
    let action_data = {}
    action_data[Constants.ACTIONTOKEY[keyword]] = data

    if (keyword == UPDATE_OPTIONS) {
        if (data == 'update location') keyword = UPDATE_RECORD_OPTION;
        else if (data == 'set alert') keyword = UPDATE_ALERT_OPTION;
    }
    else if (keyword == ALERT_OPTIONS) {
        if (data == 'list alerts') keyword = ALERT_LIST_OPTION;
        else if (data == 'add alert') keyword = ALERT_ADD_OPTION;
    }

    History.updateAction(userId, keyword, action_data).then((ret) => {
        keyword = ret;
        map_keyword_to_response(userId, data);
    })
}

async function map_keyword_to_response(userId, data) {
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
            sum.text = "Recorded: my " + hist.stuff_name + " is " + hist.stuff_position + " (" + hist.tags + ")";
            response = sum;
            break;
        case UPDATE_OPTIONS:
            response = Templates(UPDATE_OPTIONS);
            break;
        case ALERT_OPTIONS:
            response = Templates(ALERT_OPTIONS);
            break;
        case LIST_HISTORY:
            let his = await History.getStuffHistory(userId, data)
            console.log(data)
            response = Templates(LIST_HISTORY, his);
            break;
        default:
            console.log("No such keyword");
            return;
    }
    await bot.push(userId, response);
}

bot.on('postback', function (event) {
    handle_data(event.source.userId, event.postback.data);
});

bot.on('message', async function (event) {
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
                keyword = ADD_NEW_THING;
                break;
            case 'edit things':
                let allObjs = await Stuff.getUserStuff(userId);
                response = Templates(PICK_THING, allObjs);
                keyword = PICK_THING;
                break;
            case 'lost something':
                let allObjsH = await Stuff.getUserStuff(userId);
                response = Templates(PICK_THING_HIST, allObjsH);
                keyword = PICK_THING_HIST;
                break;
            case 'settings':
                break;
            default:
                handle_data(userId, message.text);
        }

        console.log(JSON.stringify(response));

        await bot.reply(event.replyToken, response);
        }
    }
});


bot.listen('/', Constants.SERVER_PORT);

