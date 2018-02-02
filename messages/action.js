
'use strict';

function Action(type, label, data, text, uri, mode, initial, max, min) {
  let result = { type };
  if (label) {
    result['label'] = label;
  }
  if (data) {
    result['data'] = data;
  }
  if (text) {
    result['text'] = text;
  }
  if (uri) {
    result['uri'] = uri;
  }
  if (mode) {
    result['mode'] = mode;
  }
  if (initial) {
    result['initial'] = initial;
  }
  if (max) {
    result['max'] = max;
  }
  if (min) {
    result['min'] = min;
  }
  return result;
}

module.exports = {
  Postback: (label, data, text) => {
    return Action('postback', label, data, text);
  },
  Message: (label, text) => {
    return Action('message', label, null, text);
  },
  URI: (label, uri) => {
    return Action('uri', label, null, null, uri);
  },
  DateTimePicker: (label, data, mode, initial, max, min) => {
    return Action('datetimepicker', label, data, null, null, mode, initial, max, min);
  }
};