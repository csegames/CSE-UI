/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var React = require('react');
var ChatLine_1 = require('./ChatLine');
var User_1 = require('./User');
var ChatMessage_1 = require('./ChatMessage');
var ChatConfig_1 = require('./ChatConfig');

var ChatRoomInfo = function ChatRoomInfo(roomId) {
    var _this = this;

    var scrollbackThreshold = arguments.length <= 1 || arguments[1] === undefined ? 50 : arguments[1];
    var scrollbackPageSize = arguments.length <= 2 || arguments[2] === undefined ? 50 : arguments[2];

    _classCallCheck(this, ChatRoomInfo);

    this.messages = [];
    this.users = [];
    this.key = 0;
    this.players = 0;
    this.unread = 0;
    this.scrollback = 0;
    this.diagnostics = function () {
        console.log('|  Room: ' + _this.roomId.name + ' Players: ' + _this.players + ' Unread: ' + _this.unread + ' Messages: ' + _this.messages.length + ' ScrollBack: ' + _this.scrollback);
    };
    this.addUser = function (user) {
        var sortIndex = _this.users.length;
        for (var i = 0; i < _this.users.length; i++) {
            if (user.isCSE) {
                if (!_this.users[i].props.info.isCSE) {
                    sortIndex = i - 1 > -1 ? i-- : 0;
                    break;
                }
            } else if (_this.users[i].props.info.isCSE) {
                continue;
            }
            if (_this.users[i].props.info.name > user.name) {
                sortIndex = i;
                break;
            }
        }
        _this.users.splice(sortIndex, 0, React.createElement(User_1.default, { key: _this.key++, info: user }));
        _this.players++;
    };
    this.removeUser = function (user) {
        var users = _this.users;
        for (var i = 0; i < users.length; i++) {
            if (users[i].props.info.name === user.name) {
                users.splice(i, 1);
                _this.players--;
                break;
            }
        }
    };
    this.add = function (message) {
        _this.messages.push(React.createElement(ChatLine_1.default, { key: _this.key++, message: message }));
        message.checkIsNewDay(_this.messages.length > 1 ? _this.messages[_this.messages.length - 2].props.message.when : undefined);
        // manage scrollback buffer size
        if (_this.messages.length > ChatConfig_1.chatConfig.SCROLLBACK_BUFFER_SIZE) {
            _this.messages.shift();
        }
    };
    this.push = function (message) {
        _this.add(message);
        _this.unread++;
    };
    this.seen = function () {
        _this.unread = 0;
    };
    this.countVisibleMessages = function () {
        var count = 0;
        _this.messages.forEach(function (message) {
            if (!ChatConfig_1.chatConfig.JOIN_PARTS) {
                // not showing JOIN/PARTS so don't count these message types
                if (message.props['message'].type === ChatMessage_1.chatType.AVAILABLE) return;
                if (message.props['message'].type === ChatMessage_1.chatType.UNAVAILABLE) return;
            }
            count++;
        });
        return count;
    };
    this.startScrollback = function () {
        var count = _this.countVisibleMessages();
        if (count > _this.scrollbackThreshold) {
            _this.scrollback = count - _this.scrollbackThreshold;
        } else {
            _this.scrollback = 0;
        }
    };
    this.cancelScrollback = function () {
        _this.scrollback = 0;
    };
    this.nextScrollbackPage = function () {
        if (_this.scrollbackPageSize > _this.scrollback) {
            _this.cancelScrollback();
        } else {
            _this.scrollback -= _this.scrollbackPageSize;
        }
    };
    this.roomId = roomId;
    this.scrollbackThreshold = scrollbackThreshold;
    this.scrollbackPageSize = scrollbackPageSize;
};

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChatRoomInfo;