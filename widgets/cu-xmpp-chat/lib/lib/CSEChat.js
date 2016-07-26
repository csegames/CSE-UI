/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var node_xmpp_client_1 = require('node-xmpp-client');
var Config_1 = require('./Config');
exports.Config = Config_1.default;
var EventEmitter_1 = require('./EventEmitter');
var Message_1 = require('./Message');
var Sender_1 = require('./Sender');
var messageType_1 = require('./messageType');
var randomString = require('randomstring');
var NS_DISCO_ITEMS = 'http://jabber.org/protocol/disco#items';
function CSELoginTokenMechanism() {}
CSELoginTokenMechanism.prototype.name = 'CSELOGINTOKEN';
CSELoginTokenMechanism.prototype.authAttrs = function () {
    return {};
};
CSELoginTokenMechanism.prototype.auth = function () {
    return this.access_token;
};
CSELoginTokenMechanism.prototype.match = function (options) {
    if (options.loginToken) {
        return true;
    }
    return false;
};

var CSEChat = function () {
    function CSEChat() {
        var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        _classCallCheck(this, CSEChat);

        this.eventEmitter = new EventEmitter_1.default();
        this._reconnect = true;
        this._idCounter = 0;
        this._iqc = 0;
        this._msgs = {};
        this._inFlight = 0;
        this._pings = {};
        this._pingsInFlight = 0;
        this.config = config;
    }
    // generate an id using an id generator


    _createClass(CSEChat, [{
        key: '_nextId',
        value: function _nextId(prefix) {
            return prefix + this._iqc++;
        }
    }, {
        key: 'connect',
        value: function connect() {
            if (this.client) return;
            this.config.init();
            this.client = new node_xmpp_client_1.Client({
                websocket: { url: this.config.websocketUrl },
                jid: 'none@chat.camelotunchained.com/' + randomString.generate(7),
                loginToken: true,
                access_token: this.config.getPassword()
            });
            this.client.registerSaslMechanism(CSELoginTokenMechanism);
            this._initializeEvents();
            return this.client;
        }
    }, {
        key: 'disconnect',
        value: function disconnect() {
            if (!this.client) return;
            if (this._pinger) {
                clearInterval(this._pinger);
                this._pinger = null;
            }
            this._reconnect = false;
            this.client.reconnect = false;
            this.client.removeAllListeners('disconnect');
            this.client.removeAllListeners('online');
            this.client.removeAllListeners('stanza');
            this.client.end();
            this.client = null;
        }
    }, {
        key: 'sendMessageToRoom',
        value: function sendMessageToRoom(message, roomName) {
            if (!this.client) return;
            this.client.send(new node_xmpp_client_1.Element('message', {
                to: roomName + '@' + this.config.service + '.' + this.config.address,
                type: 'groupchat'
            }).c('body').t(message));
        }
    }, {
        key: 'sendMessageToUser',
        value: function sendMessageToUser(message, userName) {
            if (!this.client) return;
            this.client.send(new node_xmpp_client_1.Element('message', {
                to: userName + '@' + this.config.address,
                type: 'chat'
            }).c('body').t(message));
        }
    }, {
        key: 'joinRoom',
        value: function joinRoom(roomName) {
            if (!this.client) return;
            this.client.send(new node_xmpp_client_1.Element('presence', {
                to: roomName + '/' + this.client.jid._local
            }).c('x', { xmlns: 'http://jabber.org/protocol/muc' }));
        }
    }, {
        key: 'leaveRoom',
        value: function leaveRoom(roomName) {
            if (!this.client) return;
            this.client.send(new node_xmpp_client_1.Element('presence', {
                from: this.client.jid._,
                to: roomName + '/' + this.client.jid._local,
                type: 'unavailable'
            }));
        }
    }, {
        key: 'getRooms',
        value: function getRooms() {
            if (!this.client) return;
            var id = this._nextId('room');
            this.client.send(new node_xmpp_client_1.Element('iq', {
                from: this.client.jid.toString(),
                to: this.config.serviceAddress.substr(1),
                id: id,
                type: 'get'
            }).c('query', { xmlns: NS_DISCO_ITEMS }));
            this._msgs[id] = { type: 'rooms', id: id, now: Date.now() };
            this._inFlight++;
        }
        // alias eventEmitter

    }, {
        key: 'on',
        value: function on(event, callback) {
            return this.eventEmitter.on(event, callback);
        }
    }, {
        key: 'once',
        value: function once(event, callback) {
            return this.eventEmitter.listenOnce(event, callback);
        }
    }, {
        key: 'removeListener',
        value: function removeListener(event) {
            this.eventEmitter.removeListener(event);
        }
        // PRIVATE METHODS (as private as they can be)

    }, {
        key: '_initializeEvents',
        value: function _initializeEvents() {
            var _this = this;

            if (!this.client) throw new Error('No connection to initialize');
            this.client.on('error', function (error) {
                switch (error.code) {
                    case 'EADDRNOTAVAIL':
                    case 'ENOTFOUND':
                        _this.eventEmitter.emit('error', 'Unable to connect to server at' + _this.config.address);
                        break;
                    case 'ETIMEOUT':
                        _this.eventEmitter.emit('error', 'Connection timed out.');
                        break;
                    default:
                        _this.eventEmitter.emit('error', error);
                        break;
                }
            });
            this.client.on('online', function () {
                // handle server assigned resource
                _this.config.resource = _this.client.jid._resource;
                //this.config.jid = this.client.jid.toString();
                _this.eventEmitter.emit('online');
                // send global presence
                _this.client.send(new node_xmpp_client_1.Element('presence', { type: 'available' }).c('show').t('chat'));
                _this._keepalive();
            }, this);
            this.client.on('disconnect', function () {
                _this.client = null;
                _this.eventEmitter.emit('disconnect', _this._reconnect);
                if (_this._reconnect) _this.connect();
            });
            this.client.on('stanza', function (stanza) {
                return _this._processStanza(stanza);
            });
        }
        // called when we connect.  Initialise the ping response map, the inflight count
        // and if the interval time is not running, start the interval timer.

    }, {
        key: '_keepalive',
        value: function _keepalive() {
            var _this2 = this;

            this._pings = {};
            this._pingsInFlight = 0;
            if (!this._pinger) {
                this._pinger = setInterval(function () {
                    // every 10 seconds, send a ping stanza
                    _this2._ping(function (ping) {
                        delete ping.pong; // dont pass handler to listener
                        _this2.eventEmitter.emit('ping', ping);
                    });
                }, 10000);
            }
        }
    }, {
        key: '_ping',
        value: function _ping(pong) {
            if (!pong) {
                console.error('ping without pong');
                debugger;
            }
            // If inflight is not 0, then we have a ping that was not responded to
            // so decide what to do (atm we disconnect)
            if (this._pingsInFlight > 0) {
                // not got response to last ping, disconnect, stop ping timer
                // and trigger an error condition.
                this.disconnect();
                clearInterval(this._pinger);
                this._pinger = null;
                this.eventEmitter.emit('error', 'Ping timed out');
                return;
            }
            // Create a new ping message
            var id = this._nextId('ping');
            this.client.send(new node_xmpp_client_1.Element('iq', {
                from: this.client.jid.toString(),
                to: this.config.serviceAddress.substr(1),
                id: id,
                type: 'get'
            }).c('ping', { xmlns: 'urn:xmpp:ping' }));
            // register this ping and callback, and count inflight pings
            // so we can tell if we have any outstanding
            this._pings[id] = { id: id, pong: pong, now: Date.now() };
            this._pingsInFlight++;
        }
        // handle the ping response.  Lookup the ping in the ping map, if there
        // then decrement inflight count (this ping just landed) and call the pong
        // handler, finally remove the ping from the ping map.

    }, {
        key: '_pong',
        value: function _pong(stanza) {
            var id = stanza.attrs.id;
            var ping = this._pings[id];
            if (ping) {
                this._pingsInFlight--;
                if (ping.pong) {
                    ping.pong(ping);
                } else {
                    console.warn('ping lost its pong ' + JSON.stringify(ping));
                }
                delete this._pings[id]; // reclaim memory
            }
        }
        // #########################################################################

    }, {
        key: '_processStanza',
        value: function _processStanza(stanza) {
            // if error?
            if (stanza.attrs.type === 'error') {
                return;
            }
            if (stanza.is('message')) {
                switch (stanza.attrs.type) {
                    case 'groupchat':
                        this.eventEmitter.emit('groupmessage', this._parseMessageGroup(stanza));
                        break;
                    case 'chat':
                        this.eventEmitter.emit('message', this._parseMessageChat(stanza));
                        break;
                }
                return;
            }
            if (stanza.is('presence')) {
                var x = stanza.getChild('x');
                if (!x) return;
                var status = x.getChild('status');
                if (status) return;
                this.eventEmitter.emit('presence', this._parsePresence(stanza));
                return;
            }
            if (stanza.is('iq')) {
                if (stanza.attrs.type === 'result') {
                    var bind = stanza.getChild('bind');
                    if (bind) {
                        var jid = bind.getChild('jid');
                    }
                    var ping = stanza.getChild('ping');
                    if (ping) {
                        this._pong(stanza);
                    }
                    var query = stanza.getChild('query');
                    if (query) {
                        if (query.attrs.xmlns === NS_DISCO_ITEMS) {
                            this._gotRooms(stanza.attrs.id, query);
                        }
                    }
                }
            }
        }
    }, {
        key: '_gotRooms',
        value: function _gotRooms(id, stanza) {
            var _this3 = this;

            var items = stanza.getChildren('item');
            var info = this._msgs[id];
            if (info) {
                (function () {
                    _this3._inFlight--;
                    delete _this3._msgs[id];
                    var rooms = [];
                    items.forEach(function (item) {
                        rooms.push({ name: item.attrs['name'], jid: item.attrs['jid'] });
                    });
                    _this3.eventEmitter.emit('rooms', rooms);
                })();
            }
        }
    }, {
        key: '_parseMessageGroup',
        value: function _parseMessageGroup(stanza) {
            var body = stanza.getChild('body');
            var message = body ? body.getText() : '';
            var nick = stanza.getChild('nick');
            var cseflags = stanza.getChild('cseflags');
            var isCSE = cseflags ? cseflags.attrs.cse : false;
            var fromArr = stanza.attrs.from.split('/');
            var roomName = fromArr[0].split('@')[0];
            var sender = fromArr[1];
            var senderName = nick ? nick.getText() : sender;
            var s = new Sender_1.default(0, sender, senderName, isCSE);
            return new Message_1.default(this._idCounter++, new Date(), message, roomName, messageType_1.default.MESSAGE_GROUP, s);
        }
    }, {
        key: '_parseMessageChat',
        value: function _parseMessageChat(stanza) {
            var body = stanza.getChild('body');
            var message = body ? body.getText() : '';
            var nick = stanza.getChild('nick');
            var sender = stanza.from.split('@')[0];
            var senderName = nick ? nick.getText() : sender;
            var cseflags = stanza.getChild('cseflags');
            var isCSE = cseflags ? cseflags.attrs.cse : false;
            var s = new Sender_1.default(0, sender, senderName, isCSE);
            return new Message_1.default(this._idCounter++, new Date(), message, sender, messageType_1.default.MESSAGE_CHAT, s);
        }
    }, {
        key: '_parsePresence',
        value: function _parsePresence(stanza) {
            var x = stanza.getChild('x');
            var status = x.getChild('status');
            var role = x.getChild('item').attrs.role;
            var fromArr = stanza.attrs.from.split('/');
            var room = fromArr[0];
            var roomName = room.split('@')[0];
            var sender = fromArr[1];
            var senderName = sender.split('@')[0];
            var cseflags = stanza.getChild('cseflags');
            var isCSE = cseflags ? cseflags.attrs.cse : senderName.slice(0, 3) == 'cse'; // Kludge since presence stanzas don't currently set cseflags
            var s = new Sender_1.default(0, sender, senderName, isCSE);
            if (stanza.attrs.type == "unavailable") {
                return new Message_1.default(this._idCounter++, new Date(), "", roomName, messageType_1.default.UNAVAILIBLE, s);
            }
            return new Message_1.default(this._idCounter++, new Date(), "", roomName, messageType_1.default.AVAILIBLE, s);
        }
    }]);

    return CSEChat;
}();

exports.CSEChat = CSEChat;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CSEChat;