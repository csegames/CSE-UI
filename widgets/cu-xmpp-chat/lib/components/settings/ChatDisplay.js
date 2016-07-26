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
var BooleanOption_1 = require('./BooleanOption');
var chat_defaults_1 = require('./chat-defaults');
var ChatConfig_1 = require('../ChatConfig');
var pre = new Prefixer_1.default(chat_defaults_1.prefixes.display);

var ChatDisplay = function (_React$Component) {
    _inherits(ChatDisplay, _React$Component);

    function ChatDisplay(props) {
        _classCallCheck(this, ChatDisplay);

        // initialize state from local storage
        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ChatDisplay).call(this, props));

        _this.initializeState = function () {
            var state = {};
            for (var key in chat_defaults_1.display) {
                var option = chat_defaults_1.display[key];
                var val = JSON.parse(localStorage.getItem(pre.prefix(option.key)));
                state[option.key] = val == null ? option.default : val;
            }
            return state;
        };
        _this.updateItem = function (key, value) {
            localStorage.setItem(pre.prefix(key), value);
            ChatConfig_1.chatConfig.refresh();
            _this.setState(_this.initializeState());
        };
        _this.setDefaults = function () {
            localStorage.setItem('embed-images', 'True');
            return {};
        };
        _this.generateBooleanOption = function (option) {
            var state = _this.state;
            return React.createElement(BooleanOption_1.default, { key: option.key, optionKey: option.key, title: option.title, description: option.description, isChecked: state[option.key], onChecked: _this.updateItem });
        };
        _this.state = _this.initializeState();
        return _this;
    }

    _createClass(ChatDisplay, [{
        key: 'render',
        value: function render() {
            var options = new Array();
            for (var key in chat_defaults_1.display) {
                var option = chat_defaults_1.display[key];
                switch (option.type) {
                    case 'boolean':
                        options.push(this.generateBooleanOption(option));
                        break;
                    default:
                        break;
                }
            }
            return React.createElement("div", null, options);
        }
    }]);

    return ChatDisplay;
}(React.Component);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChatDisplay;