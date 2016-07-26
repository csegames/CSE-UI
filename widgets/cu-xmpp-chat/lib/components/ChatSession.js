/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChatMessage_1 = require('./ChatMessage');
var User_1 = require('./User');
var ChatRoomInfo_1 = require('./ChatRoomInfo');
var RoomId_1 = require('./RoomId');
var ChatClient_1 = require('../lib/ChatClient');
var messageType_1 = require('../lib/messageType');
var ChatConfig_1 = require('./ChatConfig');
var ChatState_1 = require('./ChatState');
var camelot_unchained_1 = require('camelot-unchained');

var ChatSession = function () {
    function ChatSession() {
        var _this = this;

        _classCallCheck(this, ChatSession);

        this.SCROLLBACK_THRESHOLD = 50;
        this.SCROLLBACK_PAGESIZE = 100;
        this.rooms = [];
        this.currentRoom = undefined;
        this.reconnecting = false;
        this.connected = false;
        this.client = null;
        this.me = "me";
        this.windowActive = true;
        this.diagnostics = function () {
            // const memory : any = (window.performance as any).memory;
            // const now : Date = new Date();
            // console.log(now.toISOString());
            // console.log(
            //   '| Memory Usage: ' + ((((memory.usedJSHeapSize/1024/1024)*100)|0)/100) + "MB"
            //   + ' Active: ' + this.windowActive
            //   + ' Latency: ' + this.latency
            //   + ' Reconnecting: ' + this.reconnecting
            //   + ' Rooms: ' + this.rooms.length
            // );
            // this.rooms.forEach((room: ChatRoomInfo) : void => {
            //   room.diagnostics();
            // });
        };
        this.onconnect = this.onconnect.bind(this);
        this.onconnectfailed = this.onconnectfailed.bind(this);
        this.onping = this.onping.bind(this);
        this.onchat = this.onchat.bind(this);
        this.ondisconnect = this.ondisconnect.bind(this);
        this.onrooms = this.onrooms.bind(this);
        window.onblur = function () {
            return _this.windowActive = false;
        };
        window.onfocus = function () {
            _this.windowActive = true;
            var room = _this.getRoom(_this.currentRoom);
            if (room) room.seen();
        };
    }

    _createClass(ChatSession, [{
        key: 'connect',
        value: function connect(username, password) {
            var _this2 = this;

            if (!this.client) {
                this.client = new ChatClient_1.default();
                this.client.on('connect', this.onconnect);
                this.client.on('connectfailed', this.onconnectfailed);
                this.client.on('ping', this.onping);
                this.client.on('presence', this.onchat);
                this.client.on('message', this.onchat);
                this.client.on('groupmessage', this.onchat);
                this.client.on('disconnect', this.ondisconnect);
                this.client.on('rooms', this.onrooms);
                camelot_unchained_1.events.on('system_message', function (msg) {
                    return _this2.onchat({ type: messageType_1.default.SYSTEM, message: msg });
                });
                // if (!patcher.hasRealApi()) {
                //   if (username === "") username = window.prompt('username?');
                //   if (password === "###") password = window.prompt('password?');
                // }
                this.client.connect(username, password);
            }
        }
    }, {
        key: 'connectWithToken',
        value: function connectWithToken(loginToken) {
            var _this3 = this;

            if (!this.client) {
                this.client = new ChatClient_1.default();
                this.client.on('connect', this.onconnect);
                this.client.on('connectfailed', this.onconnectfailed);
                this.client.on('ping', this.onping);
                this.client.on('presence', this.onchat);
                this.client.on('message', this.onchat);
                this.client.on('groupmessage', this.onchat);
                this.client.on('disconnect', this.ondisconnect);
                this.client.on('rooms', this.onrooms);
                camelot_unchained_1.events.on('system_message', function (msg) {
                    return _this3.onchat({ type: messageType_1.default.SYSTEM, message: msg });
                });
                // if (!patcher.hasRealApi()) {
                //   if (username === "") username = window.prompt('username?');
                //   if (password === "###") password = window.prompt('password?');
                // }
                this.client.connectWithToken(loginToken);
            }
        }
    }, {
        key: 'onping',
        value: function onping(ping) {
            this.latency = Date.now() - ping.now;
            camelot_unchained_1.events.fire('chat-session-update', this);
            //this.diagnostics();
        }
    }, {
        key: 'onconnect',
        value: function onconnect() {
            // TODO: if no rooms yet, this won't work.
            this.me = this.client.chat.client.jid._local;
            ChatConfig_1.chatConfig.setNick(this.me);
            ChatState_1.chatState.set('chat', this);
            this.broadcast(new ChatMessage_1.ChatMessage(ChatMessage_1.chatType.SYSTEM, '', '', 'Connected to chat server.'));
            this.connected = true;
            this.reconnecting = false;
        }
    }, {
        key: 'onconnectfailed',
        value: function onconnectfailed() {
            // if failed to connect and we are trying to re-connect, we should
            // retry
            if (this.reconnecting) {
                // connectFailed while reconnecting, try again
                this.reconnect();
            }
        }
    }, {
        key: 'ondisconnect',
        value: function ondisconnect() {
            this.broadcast(new ChatMessage_1.ChatMessage(ChatMessage_1.chatType.SYSTEM, '', '', 'Disconnected from chat server.'));
            this.reconnect();
        }
    }, {
        key: 'onchat',
        value: function onchat(args) {
            switch (args.type) {
                case messageType_1.default.SYSTEM:
                    this.recv(new ChatMessage_1.ChatMessage(ChatMessage_1.chatType.SYSTEM, 'system', 'system', args.message, false, new Date()));
                case messageType_1.default.AVAILIBLE:
                case messageType_1.default.UNAVAILIBLE:
                    this.presence(args.type, new User_1.UserInfo(args.roomName, args.sender.sender, args.sender.isCSE));
                    break;
                case messageType_1.default.MESSAGE_CHAT:
                case messageType_1.default.MESSAGE_GROUP:
                    this.recv(new ChatMessage_1.ChatMessage(args.type === messageType_1.default.MESSAGE_CHAT ? ChatMessage_1.chatType.PRIVATE : ChatMessage_1.chatType.GROUP, args.roomName, args.sender.sender, args.message, args.sender.isCSE, args.time));
                    break;
                case messageType_1.default.NONE:
                    this.recv(new ChatMessage_1.ChatMessage(ChatMessage_1.chatType.SYSTEM, '', '', 'Unrecognised message type ' + args.type));
                    break;
            }
        }
    }, {
        key: 'reconnect',
        value: function reconnect() {
            var _this4 = this;

            this.reconnecting = true;
            // Build list of rooms to re-connect to
            var rooms = [];
            for (var i = 0; i < this.rooms.length; i++) {
                if (this.rooms[i].roomId.type === ChatMessage_1.chatType.GROUP) {
                    rooms.push(this.rooms[i].roomId.name);
                    this.rooms[i].players = 0;
                }
            }
            // Reconnect in 1s
            setTimeout(function () {
                _this4.client.reconnect(rooms);
            }, 10000);
        }
    }, {
        key: 'simulateDisconnect',
        value: function simulateDisconnect() {
            this.client.disconnect();
        }
    }, {
        key: 'getRooms',
        value: function getRooms() {
            this.client.getRooms();
        }
    }, {
        key: 'onrooms',
        value: function onrooms(items) {
            camelot_unchained_1.events.fire('chat-room-list', items);
        }
        // Broadcast a message to all rooms

    }, {
        key: 'broadcast',
        value: function broadcast(message) {
            message.type = ChatMessage_1.chatType.BROADCAST;
            // send message to current tab
            var rooms = this.rooms;
            if (rooms.length) {
                for (var i = 0; i < rooms.length; i++) {
                    rooms[i].add(message);
                }
                camelot_unchained_1.events.fire('chat-session-update', this);
            } else {}
        }
        // Receive a message from a room or user.

    }, {
        key: 'recv',
        value: function recv(message) {
            // check for a broadcast message (private message sent by "")
            if (message.type === ChatMessage_1.chatType.PRIVATE && message.nick === "chat.camelotunchained.com/warning") {
                this.broadcast(message);
            } else {
                var roomId = new RoomId_1.default(message.roomName, message.type);
                var room = this.getRoom(roomId);
                room.push(message); // increments unread
                if (!this.currentRoom) {
                    this.currentRoom = roomId;
                }
                if (this.windowActive && this.currentRoom.same(roomId)) {
                    room.seen();
                }
                camelot_unchained_1.events.fire('chat-session-update', this);
            }
        }
        // Deal with presence messages

    }, {
        key: 'presence',
        value: function presence(type, user) {
            // find the room this user is in, don't create room unless this is an available presence
            var roomId = new RoomId_1.default(user.roomName, ChatMessage_1.chatType.GROUP);
            var room = this.getRoom(roomId, type === messageType_1.default.AVAILIBLE);
            if (room) {
                // enter or leave
                if (type === messageType_1.default.AVAILIBLE) {
                    room.addUser(user);
                    room.add(new ChatMessage_1.ChatMessage(ChatMessage_1.chatType.AVAILABLE, '', user.name));
                } else {
                    room.removeUser(user);
                    room.add(new ChatMessage_1.ChatMessage(ChatMessage_1.chatType.UNAVAILABLE, '', user.name));
                }
                camelot_unchained_1.events.fire('chat-session-update', this);
            }
        }
    }, {
        key: 'setCurrentRoom',
        value: function setCurrentRoom(roomId) {
            this.currentRoom = roomId;
            camelot_unchained_1.events.fire('chat-session-update', this);
        }
    }, {
        key: 'findRoom',
        value: function findRoom(roomId) {
            for (var i = 0; i < this.rooms.length; i++) {
                if (this.rooms[i].roomId && this.rooms[i].roomId.same(roomId)) {
                    return this.rooms[i];
                }
            }
        }
    }, {
        key: 'getRoom',
        value: function getRoom(roomId) {
            var add = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

            var room = this.findRoom(roomId);
            if (!room && add) {
                room = new ChatRoomInfo_1.default(roomId, this.SCROLLBACK_THRESHOLD, this.SCROLLBACK_PAGESIZE);
                this.rooms.push(room);
            }
            return room;
        }
    }, {
        key: 'deleteRoom',
        value: function deleteRoom(roomId) {
            for (var i = 0; i < this.rooms.length; i++) {
                if (this.rooms[i].roomId.same(roomId)) {
                    var room = this.rooms[i];
                    this.rooms.splice(i, 1);
                    return room;
                }
            }
        }
    }, {
        key: 'send',
        value: function send(text, roomName) {
            this.client.sendMessageToRoom(text, roomName);
        }
    }, {
        key: 'sendMessage',
        value: function sendMessage(text, user) {
            this.client.sendMessageToUser(text, user);
            var roomId = new RoomId_1.default(user, ChatMessage_1.chatType.PRIVATE);
            var message = new ChatMessage_1.ChatMessage(ChatMessage_1.chatType.PRIVATE, user, this.me, text);
            this.getRoom(roomId).add(message);
            this.joinRoom(roomId);
            camelot_unchained_1.events.fire('chat-session-update', this);
        }
    }, {
        key: 'joinRoom',
        value: function joinRoom(roomId) {
            if (!this.findRoom(roomId)) {
                this.client.joinRoom(roomId.name);
            }
            var room = this.getRoom(roomId);
            room.seen();
            room.startScrollback();
            this.setCurrentRoom(roomId);
        }
    }, {
        key: 'leaveRoom',
        value: function leaveRoom(roomId) {
            var room = this.deleteRoom(roomId);
            if (room) {
                switch (roomId.type) {
                    case ChatMessage_1.chatType.GROUP:
                        this.client.leaveRoom(roomId.name);
                        break;
                    case ChatMessage_1.chatType.PRIVATE:
                        // no-op
                        break;
                }
                if (roomId.same(this.currentRoom)) {
                    if (this.rooms.length) {
                        this.currentRoom = this.rooms[0].roomId;
                        this.rooms[0].seen();
                        this.rooms[0].startScrollback();
                    } else {
                        this.currentRoom = undefined;
                    }
                }
                camelot_unchained_1.events.fire('chat-session-update', this);
            }
        }
        // get list of all users from rooms the user has joined

    }, {
        key: 'getAllUsers',
        value: function getAllUsers() {
            var allUsers = [];
            this.rooms.forEach(function (room) {
                room.users.forEach(function (user) {
                    if (allUsers.indexOf(user.props.info.name) < 0) allUsers.push(user.props.info.name);
                });
            });
            return allUsers;
        }
    }]);

    return ChatSession;
}();

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChatSession;