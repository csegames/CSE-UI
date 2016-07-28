/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChatState = function ChatState() {
    var _this = this;

    _classCallCheck(this, ChatState);

    this.state = {};
    this.set = function (name, value) {
        _this.state[name] = value;
    };
    this.get = function (name) {
        return _this.state[name];
    };
};

exports.ChatState = ChatState;
exports.chatState = new ChatState();