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

var camelot_unchained_1 = require('camelot-unchained');
var React = require('react');
var ChatMessage_1 = require('./ChatMessage');
var ChatLineParser_1 = require('./ChatLineParser');
var ChatConfig_1 = require('./ChatConfig');

var ChatLine = function (_React$Component) {
    _inherits(ChatLine, _React$Component);

    function ChatLine(props) {
        _classCallCheck(this, ChatLine);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(ChatLine).call(this, props));
    }

    _createClass(ChatLine, [{
        key: 'timestamp',
        value: function timestamp(message) {
            var s = "";
            var d = message.when;
            if (message.isNewDay()) s += d.toLocaleDateString() + " ";
            s += d.toLocaleTimeString();
            return s;
        }
    }, {
        key: 'buildMessage',
        value: function buildMessage(timestamp, text) {
            var classes = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

            var parser = new ChatLineParser_1.default();
            var isAction = parser.isAction(text);
            var nick = this.props.message.nick;
            var elements = void 0;
            if (isAction) {
                elements = parser.parseAction(text);
            } else {
                nick += ':';
                elements = [React.createElement("span", { key: "0", className: "chat-line-message" }, parser.parse(text))];
            }
            return React.createElement("div", { className: 'chat-line' + (classes ? ' ' + classes : '') }, timestamp, React.createElement("span", { className: 'chat-line-nick ' + (this.props.message.isCSE ? 'cse' : ''), onClick: this.PM.bind(this) }, nick), elements);
        }
    }, {
        key: 'render',
        value: function render() {
            var element = null;
            var timestamp = ChatConfig_1.chatConfig.TIMESTAMPS ? React.createElement("span", { className: "chat-timestamp" }, this.timestamp(this.props.message)) : null;
            switch (this.props.message.type) {
                case ChatMessage_1.chatType.AVAILABLE:
                    if (!ChatConfig_1.chatConfig.JOIN_PARTS) break;
                    element = React.createElement("div", { className: "chat-line" }, React.createElement("span", { className: "chat-line-entry" }, this.props.message.nick, " entered the room"));
                    break;
                case ChatMessage_1.chatType.UNAVAILABLE:
                    if (!ChatConfig_1.chatConfig.JOIN_PARTS) break;
                    element = React.createElement("div", { className: "chat-line" }, React.createElement("span", { className: "chat-line-exit" }, this.props.message.nick, " left the room"));
                    break;
                case ChatMessage_1.chatType.GROUP:
                    element = this.buildMessage(timestamp, this.props.message.text);
                    break;
                case ChatMessage_1.chatType.PRIVATE:
                    element = this.buildMessage(timestamp, this.props.message.text, 'chat-private');
                    break;
                case ChatMessage_1.chatType.SYSTEM:
                case ChatMessage_1.chatType.BROADCAST:
                    element = React.createElement("div", { className: "chat-line" }, timestamp, React.createElement("span", { className: "chat-line-system" }, this.props.message.text));
                    break;
                default:
                    element = React.createElement("div", { className: "chat-line" }, timestamp, React.createElement("span", { className: "chat-line-system" }, "[ Unrecognised chat message type ]"), React.createElement("span", { className: "chat-line-message" }, JSON.stringify(this.props.message)));
            }
            return element;
        }
    }, {
        key: 'PM',
        value: function PM() {
            camelot_unchained_1.events.fire('cse-chat-private-message', this.props.message.nick);
        }
    }]);

    return ChatLine;
}(React.Component);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChatLine;