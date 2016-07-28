"use strict";
/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

var camelot_unchained_1 = require('camelot-unchained');
var React = require('react');
var ChatState_1 = require('./ChatState');
function fromText(text, keygen) {
    return [React.createElement("span", { key: keygen(), className: 'chat-nickname', onClick: function onClick() {
            camelot_unchained_1.events.fire('cse-chat-private-message', text);
        } }, text)];
}
function createRegExp() {
    var regex = void 0;
    var chat = ChatState_1.chatState.get('chat');
    chat.getAllUsers().forEach(function (u) {
        if (!regex) {
            regex = '\\b' + u + '\\b';
        } else {
            regex += '|\\b' + u + '\\b';
        }
    });
    return new RegExp(regex, 'g');
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    fromText: fromText,
    createRegExp: createRegExp
};