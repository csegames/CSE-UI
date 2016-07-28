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
var ChatMessage_1 = require('./ChatMessage');

var Room = function (_React$Component) {
    _inherits(Room, _React$Component);

    function Room(props) {
        _classCallCheck(this, Room);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Room).call(this, props));

        _this.select = _this.select.bind(_this);
        _this.leave = _this.leave.bind(_this);
        return _this;
    }

    _createClass(Room, [{
        key: 'render',
        value: function render() {
            var players = undefined;
            var classes = ['chat-room'];
            if (this.props.selected) classes.push('chat-room-selected');
            if (this.props.roomId.type === ChatMessage_1.chatType.GROUP) {
                players = React.createElement("li", { className: "chat-room-players" }, this.props.players, " players");
            } else {
                players = React.createElement("li", { className: "chat-room-players" }, "(private)");
            }
            return React.createElement("div", { className: classes.join(' '), onClick: this.select }, React.createElement("div", { className: "chat-room-close", onClick: this.leave }), React.createElement("ul", null, React.createElement("li", { className: "chat-room-name" }, this.props.roomId.name), players), React.createElement("div", { className: this.props.unread ? 'chat-unread' : 'chat-hidden' }, this.props.unread));
        }
    }, {
        key: 'select',
        value: function select(e) {
            e.stopPropagation();
            if (!this.props.selected) {
                this.props.select(this.props.roomId);
            }
        }
    }, {
        key: 'leave',
        value: function leave(e) {
            e.stopPropagation();
            this.props.leave(this.props.roomId);
        }
    }]);

    return Room;
}(React.Component);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Room;