/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
"use strict";

var React = require('react');
var ChatLineParser_1 = require('./ChatLineParser');
var ChatConfig_1 = require('./ChatConfig');
function fromText(text, keygen, match) {
    var matchColor = match[1];
    var matchText = match[2];
    if (ChatConfig_1.chatConfig.SHOW_COLORS) {
        return [React.createElement("span", { key: keygen(), style: { color: matchColor } }, this.parse(matchText))];
    } else {
        return [React.createElement("span", { key: keygen() }, this.parse(matchText))];
    }
}
function parse(text) {
    var parser = new ChatLineParser_1.default();
    return parser.parse(text);
}
function createRegExp() {
    return (/::([A-Za-z]+|#[A-Fa-f0-9]{3,6})::([\S\s]+)$/g
    );
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    fromText: fromText,
    createRegExp: createRegExp,
    parse: parse
};