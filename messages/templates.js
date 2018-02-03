
'use strict';

const {
    ADD_NEW_THING,
    ADD_THING_PLACE,
    ADD_THING_TAGS,
    ADD_SUMMARY,
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
  }
  return result;
};
