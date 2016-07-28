/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Prefixer = function Prefixer(pfx) {
    var _this = this;

    _classCallCheck(this, Prefixer);

    this.pfx = pfx;
    this.prefix = function (s) {
        return "" + _this.pfx + s;
    };
};

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Prefixer;