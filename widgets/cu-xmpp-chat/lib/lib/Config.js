/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Config = function () {
    function Config(username, password) {
        var nick = arguments.length <= 2 || arguments[2] === undefined ? "" : arguments[2];
        var address = arguments.length <= 3 || arguments[3] === undefined ? "chat.camelotunchained.com" : arguments[3];
        var port = arguments.length <= 4 || arguments[4] === undefined ? 8222 : arguments[4];
        var endpoint = arguments.length <= 5 || arguments[5] === undefined ? "/api/chat" : arguments[5];
        var resource = arguments.length <= 6 || arguments[6] === undefined ? undefined : arguments[6];
        var service = arguments.length <= 7 || arguments[7] === undefined ? "conference" : arguments[7];

        _classCallCheck(this, Config);

        this.address = address;
        this.username = username;
        this.password = password;
        this.resource = resource;
        this.service = service;
        this.nick = nick;
        this.port = port;
        this.endpoint = endpoint;
        this.resource = resource;
        this.service = service;
    }

    _createClass(Config, [{
        key: "init",
        value: function init() {
            if (!this.serviceAddress) {
                this.serviceAddress = '@' + this.service + '.' + this.address;
                this.websocketUrl = 'ws://' + this.address + ':' + this.port + this.endpoint;
            }
        }
    }, {
        key: "getPassword",
        value: function getPassword() {
            if (typeof this.password === 'function') {
                this.password = this.password();
            }
            return this.password;
        }
    }]);

    return Config;
}();

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Config;