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

var JoinRoomListItem = function (_React$Component) {
    _inherits(JoinRoomListItem, _React$Component);

    function JoinRoomListItem(props) {
        _classCallCheck(this, JoinRoomListItem);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(JoinRoomListItem).call(this, props));

        _this.selectRoom = function () {
            _this.props.selectRoom(_this.props.room);
        };
        return _this;
    }

    _createClass(JoinRoomListItem, [{
        key: 'render',
        value: function render() {
            var name = this.props.room.jid.split('@')[0];
            return React.createElement("div", { className: "room-name", onClick: this.selectRoom }, name);
        }
    }]);

    return JoinRoomListItem;
}(React.Component);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = JoinRoomListItem;