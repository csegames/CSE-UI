/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var Prefixer_1 = require('../utils/Prefixer');
var chat_defaults_1 = require('./chat-defaults');
var pre = new Prefixer_1.default(chat_defaults_1.prefixes.rooms);

var ChatRooms = function (_React$Component) {
    _inherits(ChatRooms, _React$Component);

    function ChatRooms(props) {
        _classCallCheck(this, ChatRooms);

        // initialize state from local storage
        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ChatRooms).call(this, props));

        _this.initializeState = function () {
            var state = {};
            var val = JSON.parse(localStorage.getItem(pre.prefix('autojoins')));
            state.rooms = val == null ? chat_defaults_1.rooms : val;
            return state;
        };
        _this.state = _this.initializeState();
        return _this;
    }

    _createClass(ChatRooms, [{
        key: 'render',
        value: function render() {
            return React.createElement("div", null, "Hello from ChatRooms!");
        }
    }]);

    return ChatRooms;
}(React.Component);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChatRooms;