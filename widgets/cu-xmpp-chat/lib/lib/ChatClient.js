/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CSEChat_1 = require('./CSEChat');
var Config_1 = require('./Config');
var EventEmitter_1 = require('./EventEmitter');
var DEFAULT_ROOM_LIST = ['_global', '_cube'];

var ChatClient = function () {
    function ChatClient() {
        _classCallCheck(this, ChatClient);

        this.chat = null;
        this.connected = false;
        this.updated = 0;
        this.errorListener = null;
        this.config = null;
        this.emitter = new EventEmitter_1.default();
    }

    _createClass(ChatClient, [{
        key: '_connect',
        value: function _connect(rooms) {
            var _this = this;

            if (this.chat) {
                console.warn("ChatClient:connect() called when already connected.");
                return;
            }
            this.chat = new CSEChat_1.CSEChat(this.config);
            this.errorListener = this.chat.on('error', function (err) {
                return _this._onerror(err);
            });
            this.chat.once('online', function () {
                return _this._online(rooms);
            });
            this.chat.connect();
        }
    }, {
        key: '_online',
        value: function _online(rooms) {
            var _this2 = this;

            this.connected = true;
            this._initializeEvents();
            this._fire('connect');
            rooms = rooms.concat(this.getStoredRooms());
            var joining = {};
            rooms.forEach(function (room) {
                if (!joining[room]) {
                    joining[room] = true;
                    _this2.chat.joinRoom(room + _this2.config.serviceAddress);
                }
            });
        }
    }, {
        key: '_onerror',
        value: function _onerror(err) {
            var connected = this.connected;
            this._disconnect();
            if (!connected) {
                // if not connected when we got the error, connect failed
                this._fire('connectfailed', err);
            } else {
                // if connected when got the error, signal we were disconnected
                this._fire('disconnect');
            }
        }
    }, {
        key: '_initializeEvents',
        value: function _initializeEvents() {
            var _this3 = this;

            this.chat.on('presence', function (presence) {
                return _this3._fire('presence', presence);
            });
            this.chat.on('message', function (message) {
                return _this3._fire('message', message);
            });
            this.chat.on('groupmessage', function (message) {
                return _this3._fire('groupmessage', message);
            });
            this.chat.on('ping', function (ping) {
                return _this3._fire('ping', ping);
            });
            this.chat.on('rooms', function (rooms) {
                return _this3._fire('rooms', rooms);
            });
        }
    }, {
        key: '_disconnect',
        value: function _disconnect() {
            if (this.chat) {
                this.chat.removeListener(this.errorListener);
                this.chat.disconnect();
                this.chat = null;
            }
            this.connected = false;
        }
    }, {
        key: '_fire',
        value: function _fire(topic, data) {
            this.emitter.emit(topic, data);
            this.updated = Date.now();
        }
    }, {
        key: 'on',
        value: function on(topic, handler) {
            return this.emitter.on(topic, handler);
        }
    }, {
        key: 'off',
        value: function off(id) {
            this.emitter.removeListener(id);
        }
    }, {
        key: 'connectWithToken',
        value: function connectWithToken(loginToken) {
            var nick = arguments.length <= 1 || arguments[1] === undefined ? "" : arguments[1];
            var rooms = arguments.length <= 2 || arguments[2] === undefined ? DEFAULT_ROOM_LIST : arguments[2];

            if (this.chat) {
                console.warn("ChatClient:connect() called when already connected.");
                return;
            }
            // this._fire("connecting");
            this.connected = false;
            this.updated = 0;
            this.config = new Config_1.default('', loginToken, nick);
            this._connect(rooms);
        }
    }, {
        key: 'connect',
        value: function connect(username, password) {
            var nick = arguments.length <= 2 || arguments[2] === undefined ? "" : arguments[2];
            var rooms = arguments.length <= 3 || arguments[3] === undefined ? DEFAULT_ROOM_LIST : arguments[3];

            if (this.chat) {
                console.warn("ChatClient:connect() called when already connected.");
                return;
            }
            // this._fire("connecting");
            this.connected = false;
            this.updated = 0;
            this.config = new Config_1.default(username, password, nick);
            this._connect(rooms);
        }
    }, {
        key: 'disconnect',
        value: function disconnect() {
            this._disconnect();
            this._fire('disconnect');
        }
    }, {
        key: 'reconnect',
        value: function reconnect(rooms) {
            this._connect(rooms);
        }
    }, {
        key: 'getNick',
        value: function getNick() {
            return this.chat.client.jid._local;
        }
    }, {
        key: 'getStoredRooms',
        value: function getStoredRooms() {
            var storedRooms = localStorage.getItem("CSE_CHAT_Stored_channels");
            if (storedRooms != null) {
                return storedRooms.split(",");
            }
            return [];
        }
    }, {
        key: 'removeFromStoredRooms',
        value: function removeFromStoredRooms(room) {
            var storedRooms = this.getStoredRooms();
            var idx = storedRooms.indexOf(room);
            if (idx != -1) {
                storedRooms.splice(idx, 1);
            }
            this.setStoredRooms(storedRooms);
        }
    }, {
        key: 'addToStoredRooms',
        value: function addToStoredRooms(room) {
            var storedRooms = this.getStoredRooms();
            var idx = storedRooms.indexOf(room);
            if (idx != -1) {
                return;
            }
            storedRooms.push(room);
            this.setStoredRooms(storedRooms);
        }
    }, {
        key: 'setStoredRooms',
        value: function setStoredRooms(rooms) {
            if (rooms.length > 0) {
                localStorage.setItem("CSE_CHAT_Stored_channels", rooms.toString());
            } else {
                localStorage.removeItem("CSE_CHAT_Stored_channels");
            }
        }
    }, {
        key: 'sendMessageToRoom',
        value: function sendMessageToRoom(message, roomName) {
            if (!this.chat || !this.connected) {
                console.warn("ChatClient:sendMessageToRoom() called when not connected.");
                return;
            }
            this.chat.sendMessageToRoom(message, roomName);
        }
        // ChatAction.sendMessageToUser(...)

    }, {
        key: 'sendMessageToUser',
        value: function sendMessageToUser(message, userName) {
            if (!this.chat || !this.connected) {
                console.warn("ChatClient:sendMessageToUser() called when not connected.");
                return;
            }
            this.chat.sendMessageToUser(message, userName);
        }
    }, {
        key: 'joinRoom',
        value: function joinRoom(roomName) {
            if (!this.chat) {
                console.warn("ChatClient:joinRoom() called when not connected.");
                return;
            }
            this.chat.joinRoom(roomName + this.chat.config.serviceAddress);
            this.addToStoredRooms(roomName);
        }
    }, {
        key: 'leaveRoom',
        value: function leaveRoom(roomName) {
            if (!this.chat) {
                console.warn("ChatClient:leaveRoom() called when not connected.");
                return;
            }
            this.chat.leaveRoom(roomName + this.chat.config.serviceAddress);
            this.removeFromStoredRooms(roomName);
        }
    }, {
        key: 'getRooms',
        value: function getRooms() {
            if (!this.chat) {
                console.warn("ChatClient:leaveRoom() called when not connected.");
                return;
            }
            this.chat.getRooms();
        }
    }]);

    return ChatClient;
}();

;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChatClient;