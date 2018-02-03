
'use strict';

var Action = require('./action');

const {
    ADD_NEW_THING,
    ADD_THING_PLACE,
    ADD_THING_TAGS,
    ADD_SUMMARY,
    PICK_THING,
    PICK_THING_HIST,
    ALERT_LIST,
    LIST_HISTORY,
} = require('../constants').ACTION;

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

let lostSomething = {

}

let updateOptions = {
    "type": "template",
    "altText": "This is a buttons template",
    "template": {
        "type": "buttons",
        "title": "Options",
        "text": "Please select one:",
        "actions": [
        {
            "type": "postback",
            "label": "Update location",
            "data": "update location"
        },
        {
            "type": "postback",
            "label": "Set alert",
            "data": "set alert"
        },
        {
            "type": "postback",
            "label": "Back",
            "data": "back"
        }
        ]
    }
};

let alertOptions = {
    "type": "template",
    "altText": "This is a buttons template",
    "template": {
        "type": "buttons",
        "title": "Alert options",
        "text": "Please select one:",
        "actions": [
        {
            "type": "postback",
            "label": "List alerts",
            "data": "list alerts"
        },
        {
            "type": "postback",
            "label": "Add an alert",
            "data": "add alert"
        },
        {
            "type": "postback",
            "label": "Back",
            "data": "back"
        }
        ]
    }
};

let alertDatePicker = {  
   "type":"datetimepicker",
   "label":"Select time",
   "data":"storeId=12345",
   "mode":"time",
   "initial":"2018-02-03t00:00",
   "max":"2019-02-03t23:59",
   "min":"2018-02-03t00:00"
}

function pickThing(data) {
    if (!data || !Array.isArray(data)) {
        return;
    }
    let filteredData = data.length > 10 ? data.slice(0, 10) : data;
    let result = {
        "type": "template",
        "altText": "Which item do you want to update?",
        "template": {
            "type": "carousel"
        }
    };
    let columns = filteredData.map((obj)=>{
        return {
            "text": obj.stuff_name,
            "actions": [Action.Postback("Choose", obj.stuff_id)]
        }
    });
    result['template']['columns'] = columns;
    return result;
}

function alertList(data) {
    if (!data || !Array.isArray(data)) {
        return;
    }
    let filteredData = data.length > 10 ? data.slice(0, 10) : data;
    let result = {
        "type": "template",
        "altText": "Please choose a reminder",
        "template": {
            "type": "carousel"
        }
    };
    let columns = filteredData.map((obj)=>{
        let timeString = "";
        if (obj.schedule_time) {
            timeString = obj.schedule_time.getHours() + ":" + obj.schedule_time.getMinutes();
        }
        return {
            "title": obj.stuff_name,
            "text": timeString,
            "actions": [
                Action.Postback("Edit", obj.id),
                Action.Postback("Delete", obj.id),
                Action.Postback("Back", obj.id)
            ]
        }
    });
    result['template']['columns'] = columns;
    return result;
}

function listHistory(data) {
    if (!data || !Array.isArray(data)) {
        return;
    }
    let filteredData = data.length > 10 ? data.slice(0, 10) : data;
    let result = {
        "type": "template",
        "altText": "Your item history",
        "template": {
            "type": "carousel"
        }
    };
    let columns = filteredData.map((obj)=>{
        return {
            "title": obj.created.toISOString(),
            "text": obj.stuff_position + '\n' + obj.tags,
            "actions": [
                Action.Postback("Back", "back")
            ]
        }
    });
    result['template']['columns'] = columns;
    return result;
}

module.exports = function(key, data) {
  let result = null;
  switch(key) {
    case ADD_NEW_THING:
        result = addNewThing
        break;
    case ADD_THING_PLACE:
        result = addThingPlace;
        break;
    case ADD_THING_TAGS:
        result = addThingTags;
        break;
    case PICK_THING:
    case PICK_THING_HIST:
        result = pickThing(data);
        break;
    case ALERT_LIST:
        result = alertList(data);
        break;
    case LIST_HISTORY:
        result = listHistory(data);
        break;
  }
  return result;
};