/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
"use strict";

var React = require('react');
var ChatLineParser_1 = require('./ChatLineParser');
function fromText(text, keygen, match) {
    if (match && (match[2] || match[4])) {
        var matchBeginChar = match[1] ? match[1] : '';
        var matchEndChar = match[6] ? match[6] : '';
        var matchCount = match[2] ? match[2].length : match[4].length;
        var matchText = match[2] ? matchBeginChar + match[3] + matchEndChar : matchBeginChar + match[5] + matchEndChar;
        if (matchCount === 1) {
            return [React.createElement("i", { key: keygen() }, this.parse(matchText))];
        } else {
            return [React.createElement("b", { key: keygen() }, this.parse(matchText))];
        }
    }
}
function parse(text) {
    var parser = new ChatLineParser_1.default();
    return parser.parse(text);
}
function createRegExp() {
    return (/(^|\s)(?:(\*\*|\*)([^\*]+)\2)|(?:(__|_)([^_]+)\4)($|\s)/g
    );
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    fromText: fromText,
    createRegExp: createRegExp,
    parse: parse
};