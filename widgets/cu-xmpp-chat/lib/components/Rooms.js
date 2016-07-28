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
var Room_1 = require('./Room');

var RoomsState = function RoomsState() {
    _classCallCheck(this, RoomsState);
};

exports.RoomsState = RoomsState;

var RoomsProps = function RoomsProps() {
    _classCallCheck(this, RoomsProps);
};

exports.RoomsProps = RoomsProps;

var Rooms = function (_React$Component) {
    _inherits(Rooms, _React$Component);

    function Rooms(props) {
        _classCallCheck(this, Rooms);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Rooms).call(this, props));
    }

    _createClass(Rooms, [{
        key: 'render',
        value: function render() {
            var unreadTotal = 0;
            var content = [];
            var rooms = this.props.rooms;
            for (var i = 0; i < rooms.length; i++) {
                unreadTotal += rooms[i].unread;
                content.push(React.createElement(Room_1.default, { key: i, roomId: rooms[i].roomId, players: rooms[i].players, unread: rooms[i].unread, selected: rooms[i].roomId.same(this.props.current), select: this.props.select, leave: this.props.leave }));
            }
            // update title to display unread
            document.title = unreadTotal > 0 ? '(' + unreadTotal + ') Camelot Unchained' : 'Camelot Unchained';
            return React.createElement("div", { className: "chat-tab-content chat-rooms" }, content);
        }
    }]);

    return Rooms;
}(React.Component);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Rooms;