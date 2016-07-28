/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Sender = function Sender(id, sender, senderName, isCSE) {
    _classCallCheck(this, Sender);

    this.id = id;
    this.sender = sender;
    this.senderName = senderName;
    this.isCSE = isCSE;
};

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Sender;