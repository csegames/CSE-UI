/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var React = require('react');
var ChatTextParser_1 = require('./ChatTextParser');
var ChatConfig_1 = require('./ChatConfig');
var ParseColors_1 = require('./ParseColors');
var ParseMarkdown_1 = require('./ParseMarkdown');
var ParseLinks_1 = require('./ParseLinks');
var ParseRooms_1 = require('./ParseRooms');
var ParseEmoji_1 = require('./ParseEmoji');
var ParseHighlight_1 = require('./ParseHighlight');
var ParseNicks_1 = require('./ParseNicks');

var ChatLineParser = function () {
    function ChatLineParser() {
        _classCallCheck(this, ChatLineParser);

        this._key = 1;
    }

    _createClass(ChatLineParser, [{
        key: '_parseText',
        value: function _parseText(text) {
            return [React.createElement("span", { key: this._key++ }, text)];
        }
    }, {
        key: 'parseAction',
        value: function parseAction(text) {
            var html = [];
            var content = this.parse(text.substr(4).trim());
            html.push(React.createElement("span", { key: this._key++, className: "chat-line-action" }, "<", content, ">"));
            return html;
        }
    }, {
        key: 'isAction',
        value: function isAction(text) {
            return text.toLowerCase().substr(0, 4) === '/me ';
        }
    }, {
        key: 'parse',
        value: function parse(text) {
            var _this = this;

            var keygen = function keygen() {
                return _this._key++;
            };
            var tokens = [];
            // Parsers which need recursion should be first
            tokens.push({ token: ChatLineParser.COLOR, expr: ParseColors_1.default.createRegExp() });
            if (ChatConfig_1.chatConfig.SHOW_MARKDOWN) {
                tokens.push({ token: ChatLineParser.MARKDOWN, expr: ParseMarkdown_1.default.createRegExp() });
            }
            // Parsers with simple search/replace should be last
            tokens.push({ token: ChatLineParser.LINK, expr: ParseLinks_1.default.createRegExp() });
            tokens.push({ token: ChatLineParser.ROOM, expr: ParseRooms_1.default.createRegExp() });
            if (ChatConfig_1.chatConfig.SHOW_EMOTICONS) {
                tokens.push({ token: ChatLineParser.EMOJI, expr: ParseEmoji_1.default.createRegExp() });
            }
            var highlights = ChatConfig_1.chatConfig.getHighlights();
            if (highlights.length) {
                tokens.push({ token: ChatLineParser.HIGHLIGHT, expr: ParseHighlight_1.default.createRegExp(highlights) });
            }
            tokens.push({ token: ChatLineParser.NICK, expr: ParseNicks_1.default.createRegExp() });
            // Run through each parser
            var parser = new ChatTextParser_1.ChatTextParser(tokens);
            return parser.parse(text, function (token, text, match) {
                switch (token) {
                    case ChatLineParser.COLOR:
                        return ParseColors_1.default.fromText(text, keygen, match);
                    case ChatLineParser.MARKDOWN:
                        return ParseMarkdown_1.default.fromText(text, keygen, match);
                    case ChatLineParser.LINK:
                        return ParseLinks_1.default.fromText(text, keygen);
                    case ChatLineParser.ROOM:
                        return ParseRooms_1.default.fromText(text, keygen);
                    case ChatLineParser.EMOJI:
                        return ParseEmoji_1.default.fromText(text, keygen);
                    case ChatLineParser.HIGHLIGHT:
                        return ParseHighlight_1.default.fromText(text, keygen);
                    case ChatLineParser.NICK:
                        return ParseNicks_1.default.fromText(text, keygen);
                }
                // treat everything else as just text
                return _this._parseText(text);
            });
        }
    }]);

    return ChatLineParser;
}();

ChatLineParser.LINK = ChatTextParser_1.ChatTextParser.TEXT + 1;
ChatLineParser.EMOJI = ChatTextParser_1.ChatTextParser.TEXT + 2;
ChatLineParser.MARKDOWN = ChatTextParser_1.ChatTextParser.TEXT + 3;
ChatLineParser.COLOR = ChatTextParser_1.ChatTextParser.TEXT + 4;
ChatLineParser.ROOM = ChatTextParser_1.ChatTextParser.TEXT + 5;
ChatLineParser.HIGHLIGHT = ChatTextParser_1.ChatTextParser.TEXT + 6;
ChatLineParser.NICK = ChatTextParser_1.ChatTextParser.TEXT + 7;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChatLineParser;