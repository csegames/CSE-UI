/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChatTextParser = function () {
    function ChatTextParser(tokens) {
        _classCallCheck(this, ChatTextParser);

        this.tokens = tokens;
    }

    _createClass(ChatTextParser, [{
        key: "parse",
        value: function parse(text, callback) {
            var index = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

            var html = [];
            var insert = void 0;
            var section = void 0;
            var re = void 0;
            var match = void 0;
            var next = void 0;
            if (this.tokens.length > index) {
                re = this.tokens[index].expr;
                next = 0;
                // find all matches for this token
                for (match = re.exec(text); match; match = re.exec(text)) {
                    // parse text before match
                    if (match.index > next) {
                        section = text.substr(next, match.index - next);
                        insert = this.parse(section, callback, index + 1);
                        html = html.concat(insert);
                    }
                    // parse the match *only* if its not empty
                    if (match[0]) {
                        insert = callback(this.tokens[index].token, match[0], match);
                        if (!insert) {
                            // text didn't match after all, parse again
                            insert = this.parse(match[0], callback, index + 1);
                        }
                        html = html.concat(insert);
                    } else {
                        console.warn('bailing, regular expression returning empty match, brain fried, core dumped!');
                        break;
                    }
                    // track where we are up to
                    next = match.index + match[0].length;
                }
                // parse trailing text
                if (next < text.length) {
                    section = text.substr(next);
                    insert = this.parse(section, callback, index + 1);
                    html = html.concat(insert);
                }
                return html;
            }
            // no more tokens, just treat as text
            return callback(ChatTextParser.TEXT, text, null);
        }
    }]);

    return ChatTextParser;
}();

ChatTextParser.TEXT = 0;
exports.ChatTextParser = ChatTextParser;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChatTextParser;