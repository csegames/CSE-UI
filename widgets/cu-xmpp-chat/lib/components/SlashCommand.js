"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RoomId_1 = require('./RoomId');
var ChatMessage_1 = require('./ChatMessage');

var SlashCommand = function () {
    function SlashCommand(command) {
        _classCallCheck(this, SlashCommand);

        this.name = command.split(' ')[0];
        this.args = command.substr(this.name.length + 1);
        this.argv = this.args.length ? this.args.split(' ') : [];
    }

    _createClass(SlashCommand, [{
        key: 'exec',
        value: function exec(session) {
            switch (this.name) {
                case 'w':
                case 't':
                case 'tell':
                case 'pm':
                case 'msg':
                    if (this.argv.length > 1) {
                        var user = this.argv[0];
                        var message = this.args.substr(user.length + 1).trim();
                        session.sendMessage(message, user);
                    }
                    return true;
                case 'join':
                    if (this.argv.length === 1) {
                        session.joinRoom(new RoomId_1.default(this.argv[0], ChatMessage_1.chatType.GROUP));
                    }
                    return true;
                case 'leave':
                    if (this.argv.length === 1) {
                        session.leaveRoom(new RoomId_1.default(this.argv[0], ChatMessage_1.chatType.GROUP));
                        session.leaveRoom(new RoomId_1.default(this.argv[0], ChatMessage_1.chatType.PRIVATE));
                    } else {
                        session.leaveRoom(session.currentRoom);
                    }
                    return true;
            }
            return false; // command was not recognised
        }
    }]);

    return SlashCommand;
}();

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SlashCommand;