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
var RoomId_1 = require('./RoomId');
var ChatMessage_1 = require('./ChatMessage');
var JoinRoomModal_1 = require('./JoinRoomModal');
var Animate = require('react-animate.css');

var JoinRoomButton = function (_React$Component) {
    _inherits(JoinRoomButton, _React$Component);

    function JoinRoomButton(props) {
        _classCallCheck(this, JoinRoomButton);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(JoinRoomButton).call(this, props));

        _this.showModal = function () {
            _this.setState({ showJoinRoomModal: true });
        };
        _this.closeModal = function () {
            _this.setState({ showJoinRoomModal: false });
        };
        _this.joinRoom = function (room) {
            _this.props.join(new RoomId_1.default(room, ChatMessage_1.chatType.GROUP));
            _this.setState({ showJoinRoomModal: false });
        };
        _this.generateJoinRoomModal = function () {
            return React.createElement("div", { className: 'fullscreen-blackout', key: 'join-room' }, React.createElement(JoinRoomModal_1.default, { closeModal: _this.closeModal, joinRoom: _this.joinRoom, getRooms: _this.props.getRooms }));
        };
        _this.promptRoom = _this.promptRoom.bind(_this);
        _this.state = { showJoinRoomModal: false };
        return _this;
    }
    // <Animate animationEnter='slideInUp' animationLeave='slideOutDown'
    //         durationEnter={400} durationLeave={500}>
    //         {modal}
    //       </Animate>


    _createClass(JoinRoomButton, [{
        key: 'render',
        value: function render() {
            var modal = this.state.showJoinRoomModal ? this.generateJoinRoomModal() : null;
            return React.createElement("div", null, React.createElement("div", { className: "chat-room-join-button", onClick: this.showModal }, "+ Join Room"), modal);
        }
    }, {
        key: 'promptRoom',
        value: function promptRoom() {
            var room = window.prompt('Room?');
            this.props.join(new RoomId_1.default(room, ChatMessage_1.chatType.GROUP));
        }
    }]);

    return JoinRoomButton;
}(React.Component);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = JoinRoomButton;