/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Message = function Message(id, time, message, roomName, type, sender) {
    _classCallCheck(this, Message);

    this.id = id;
    this.time = time;
    this.message = message;
    this.roomName = roomName;
    this.sender = sender;
    this.type = type;
};

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Message;