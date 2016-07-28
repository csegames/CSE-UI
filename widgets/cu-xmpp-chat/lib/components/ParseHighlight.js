"use strict";

var React = require('react');
function fromText(text, keygen) {
    //events.fire('chat-play-sound-highlight');
    return [React.createElement("span", { key: keygen(), className: 'chat-room-highlight' }, text)];
}
function createRegExp(highlight) {
    var regex = void 0;
    highlight.forEach(function (h) {
        if (!regex) {
            regex = '(?:^|\\s)@?' + h + ':?(?:$|\\s)';
        } else {
            regex += '|(?:^|\\s)@?' + h + ':?(?:$|\\s)';
        }
    });
    return new RegExp(regex, 'g');
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    fromText: fromText,
    createRegExp: createRegExp
};