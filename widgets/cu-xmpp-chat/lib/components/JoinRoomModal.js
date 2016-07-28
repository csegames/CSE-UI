"use strict";
/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var camelot_unchained_1 = require('camelot-unchained');
var React = require('react');
var JoinRoomList_1 = require('./JoinRoomList');

var JoinRoomModal = function (_React$Component) {
    _inherits(JoinRoomModal, _React$Component);

    function JoinRoomModal(props) {
        _classCallCheck(this, JoinRoomModal);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(JoinRoomModal).call(this, props));

        _this.getRooms = function () {
            camelot_unchained_1.events.once('chat-room-list', _this.gotRooms);
            _this.props.getRooms();
        };
        _this.gotRooms = function (rooms) {
            _this.setState({ rooms: rooms });
        };
        _this.joinRoom = function () {
            var input = _this.refs['roomInput'];
            _this.props.joinRoom(input.value);
        };
        _this.selectRoom = function (room) {
            _this.props.joinRoom(room.jid.split('@')[0]);
        };
        _this.state = _this.initialState();
        return _this;
    }

    _createClass(JoinRoomModal, [{
        key: 'initialState',
        value: function initialState() {
            return {
                rooms: [],
                filter: ""
            };
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            var input = this.refs['roomInput'];
            var join = this.refs['join'];
            // without this timeout, the label doesn't animate up above the input box
            setTimeout(function () {
                input.focus();
            }, 500);
            join.disabled = true;
            input.addEventListener('keyup', function (ev) {
                join.disabled = input.value.length === 0;
                if (input.value.length > 0 && ev.keyCode === 13) {
                    _this2.props.joinRoom(input.value);
                } else {
                    _this2.setState({ filter: input.value });
                }
            });
            this.getRooms();
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement("div", { className: "modal-dialog join-room-modal" }, React.createElement("div", { className: "input-field" }, React.createElement("input", { id: "room", type: "text", ref: "roomInput" }), React.createElement("label", { htmlFor: "room" }, "Room Name"), React.createElement(JoinRoomList_1.default, { rooms: this.state.rooms, filter: this.state.filter, selectRoom: this.selectRoom })), React.createElement("button", { className: "wave-effects btn-flat", onClick: this.joinRoom, ref: "join" }, "JOIN ROOM"), React.createElement("button", { className: "wave-effects btn-flat", onClick: this.props.closeModal }, "CANCEL"));
        }
    }]);

    return JoinRoomModal;
}(React.Component);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = JoinRoomModal;