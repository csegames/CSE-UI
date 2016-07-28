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
var camelot_unchained_1 = require('camelot-unchained');
var camelot_unchained_2 = require('camelot-unchained');
var ChatSession_1 = require('./components/ChatSession');
var ChatMessage_1 = require('./components/ChatMessage');
var SlashCommand_1 = require('./components/SlashCommand');
var RoomId_1 = require('./components/RoomId');
var ChatConfig_1 = require('./components/ChatConfig');
var Info_1 = require('./components/Info');
var Content_1 = require('./components/Content');
var chat_defaults_1 = require('./components/settings/chat-defaults');

var Chat = function (_React$Component) {
    _inherits(Chat, _React$Component);

    function Chat(props) {
        _classCallCheck(this, Chat);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Chat).call(this, props));

        _this._eventHandlers = [];
        // Get current tab
        _this.getCurrentRoom = function () {
            return _this.state.chat.getRoom(_this.state.chat.currentRoom);
        };
        // Send a message to the current room, named room (not implemented) or user (not implemneted)
        _this.send = function (roomId, text) {
            switch (roomId.type) {
                case ChatMessage_1.chatType.GROUP:
                    _this.state.chat.send(text, roomId.name);
                    break;
                case ChatMessage_1.chatType.PRIVATE:
                    _this.state.chat.sendMessage(text, roomId.name);
                    break;
            }
        };
        _this.update = function (chat) {
            _this.setState({ chat: chat, now: Date.now() });
        };
        _this.optionsUpdated = function (config) {
            _this.setState({ config: config, now: Date.now() });
        };
        _this.selectRoom = function (roomId) {
            _this.state.chat.joinRoom(roomId);
        };
        _this.leaveRoom = function (roomId) {
            _this.state.chat.leaveRoom(roomId);
        };
        _this.joinRoom = function (roomName) {
            _this.state.chat.joinRoom(new RoomId_1.default(roomName, ChatMessage_1.chatType.GROUP));
        };
        _this.slashCommand = function (command) {
            if (camelot_unchained_1.parseMessageForSlashCommand(command)) return true;
            var cmd = new SlashCommand_1.default(command);
            if (cmd.exec(_this.state.chat)) return true;
            camelot_unchained_1.client.SendSlashCommand(command);
            return true;
        };
        _this.close = function () {
            window["_cse_chat_session"] = _this.state.chat;
            _this.props.hideChat();
        };
        _this.disconnect = function () {
            _this.state.chat.simulateDisconnect();
        };
        _this.getRooms = function () {
            _this.state.chat.getRooms();
        };
        _this.state = _this.initialState();
        // load configuration (before subscribing to options updates!)
        ChatConfig_1.chatConfig.refresh();
        // handle updates to chat session
        _this._eventHandlers.push(camelot_unchained_2.events.on('chat-session-update', _this.update));
        _this._eventHandlers.push(camelot_unchained_2.events.on('chat-show-room', _this.joinRoom));
        _this._eventHandlers.push(camelot_unchained_2.events.on('chat-options-update', _this.optionsUpdated));
        // Initialize chat settings in localStorage
        chat_defaults_1.initLocalStorage();
        return _this;
    }

    _createClass(Chat, [{
        key: 'initialState',
        value: function initialState() {
            return {
                chat: window['_cse_chat_session'] || new ChatSession_1.default(),
                now: 0,
                config: ChatConfig_1.chatConfig
            };
        }
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
            // hook up to chat
            this.state.chat.connectWithToken(this.props.loginToken);
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            if (!this.state.chat.currentRoom) {
                var roomId = new RoomId_1.default('_global', ChatMessage_1.chatType.GROUP);
                this.state.chat.setCurrentRoom(roomId);
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this._eventHandlers.forEach(function (value) {
                camelot_unchained_2.events.off(value);
            });
        }
        // Render chat

    }, {
        key: 'render',
        value: function render() {
            var current = this.state.chat.currentRoom;
            var room = current ? this.state.chat.getRoom(current) : undefined;
            var closeButton = this.props.hideChat ? React.createElement("div", { className: 'chat-close', onClick: this.close }, "Close") : null;
            return React.createElement("div", { className: "cse-chat no-select" }, React.createElement("div", { className: "chat-disconnect" }, this.state.chat.latency), React.createElement("div", { className: "chat-frame" }, React.createElement(Info_1.default, { chat: this.state.chat, currentRoom: this.state.chat.currentRoom, selectRoom: this.selectRoom, leaveRoom: this.leaveRoom }), React.createElement(Content_1.default, { room: room, send: this.send, slashCommand: this.slashCommand })), closeButton);
        }
    }]);

    return Chat;
}(React.Component);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Chat;