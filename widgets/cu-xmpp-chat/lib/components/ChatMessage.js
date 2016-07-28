/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var chatType;
(function (chatType) {
    chatType[chatType["AVAILABLE"] = 1] = "AVAILABLE";
    chatType[chatType["UNAVAILABLE"] = 2] = "UNAVAILABLE";
    chatType[chatType["PRIVATE"] = 3] = "PRIVATE";
    chatType[chatType["GROUP"] = 4] = "GROUP";
    chatType[chatType["SYSTEM"] = 5] = "SYSTEM";
    chatType[chatType["BROADCAST"] = 6] = "BROADCAST";
})(chatType || (chatType = {}));
exports.chatType = chatType;

var ChatMessage = function () {
    function ChatMessage(type, roomName) {
        var nick = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
        var text = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
        var isCSE = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];
        var time = arguments.length <= 5 || arguments[5] === undefined ? new Date() : arguments[5];

        _classCallCheck(this, ChatMessage);

        this.type = type;
        this.roomName = roomName.toLowerCase();
        this.nick = nick.toLowerCase();
        this.text = text;
        this.isCSE = isCSE;
        this.when = time;
        this._newDay = false; // we don't know yet, assumed not
    }

    _createClass(ChatMessage, [{
        key: "isNewDay",
        value: function isNewDay() {
            return this._newDay;
        }
    }, {
        key: "checkIsNewDay",
        value: function checkIsNewDay(prev) {
            if (!prev || prev.toLocaleDateString() !== this.when.toLocaleDateString()) {
                // message is for a new day, flag it as such
                // first message in a room is always flagged as a new day
                this._newDay = true;
            }
        }
    }]);

    return ChatMessage;
}();

exports.ChatMessage = ChatMessage;