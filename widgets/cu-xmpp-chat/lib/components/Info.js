/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var React = require('react');
var Tabs_1 = require('./Tabs');
var Rooms_1 = require('./Rooms');
var JoinRoomButton_1 = require('./JoinRoomButton');
var Users_1 = require('./Users');
var Settings_1 = require('./settings/Settings');

var InfoState = function InfoState() {
    _classCallCheck(this, InfoState);

    this.currentTab = "rooms";
};

exports.InfoState = InfoState;

var Info = function (_React$Component) {
    _inherits(Info, _React$Component);

    function Info(props) {
        _classCallCheck(this, Info);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Info).call(this, props));

        _this.state = new InfoState();
        _this.select = _this.select.bind(_this);
        _this.getRooms = _this.getRooms.bind(_this);
        return _this;
    }

    _createClass(Info, [{
        key: 'getRooms',
        value: function getRooms() {
            this.props.chat.getRooms(); // handle callback
        }
    }, {
        key: 'render',
        value: function render() {
            var content = [];
            switch (this.state.currentTab) {
                case 'settings':
                    content.push(React.createElement(Settings_1.default, { key: 'setings' }));
                    break;
                case 'users':
                    content.push(React.createElement(Users_1.default, { key: "users", room: this.props.chat.getRoom(this.props.currentRoom) }));
                    break;
                case 'rooms':
                default:
                    content.push(React.createElement(Rooms_1.default, { key: "rooms", rooms: this.props.chat.rooms, current: this.props.currentRoom, select: this.props.selectRoom, leave: this.props.leaveRoom }));
                    content.push(React.createElement(JoinRoomButton_1.default, { key: "join-button", join: this.props.selectRoom, getRooms: this.getRooms }));
                    break;
            }
            return React.createElement("div", { className: "chat-info" }, React.createElement(Tabs_1.default, { current: this.state.currentTab, select: this.select }), content);
        }
    }, {
        key: 'select',
        value: function select(tab) {
            if (this.state.currentTab !== tab) {
                this.setState({ currentTab: tab });
            }
        }
    }]);

    return Info;
}(React.Component);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Info;