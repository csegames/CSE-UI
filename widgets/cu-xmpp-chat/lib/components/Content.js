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
var ChatText_1 = require('./ChatText');
var ChatInput_1 = require('./ChatInput');

var Content = function (_React$Component) {
    _inherits(Content, _React$Component);

    function Content() {
        var _Object$getPrototypeO;

        _classCallCheck(this, Content);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(Content)).call.apply(_Object$getPrototypeO, [this].concat(args)));

        _this.send = function (text) {
            _this.props.send(_this.props.room.roomId, text);
        };
        _this.scroll = function () {
            var text = _this.refs['text'];
            text.autoScrollToBottom();
        };
        return _this;
    }

    _createClass(Content, [{
        key: 'render',
        value: function render() {
            return React.createElement("div", { className: "chat-content" }, React.createElement(ChatText_1.default, { ref: "text", room: this.props.room }), React.createElement(ChatInput_1.default, { label: "SEND", send: this.send, slashCommand: this.props.slashCommand, scroll: this.scroll }));
        }
    }]);

    return Content;
}(React.Component);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Content;