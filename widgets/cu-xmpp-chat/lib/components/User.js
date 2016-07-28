"use strict";
/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var camelot_unchained_1 = require('camelot-unchained');
var React = require('react');

var UserInfo = function UserInfo(roomName, name, isCSE) {
    _classCallCheck(this, UserInfo);

    this.roomName = roomName;
    this.name = name;
    this.isCSE = isCSE;
};

exports.UserInfo = UserInfo;

var User = function (_React$Component) {
    _inherits(User, _React$Component);

    function User(props) {
        _classCallCheck(this, User);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(User).call(this, props));

        _this.PM = _this.PM.bind(_this);
        return _this;
    }

    _createClass(User, [{
        key: 'render',
        value: function render() {
            var classes = ['chat-info-user'];
            if (this.props.selected) classes.push('chat-info-user-selected');
            if (this.props.info.isCSE) classes.push('chat-info-cseuser');
            return React.createElement("div", { className: classes.join(' '), onClick: this.PM }, this.props.info.name);
        }
    }, {
        key: 'PM',
        value: function PM() {
            camelot_unchained_1.events.fire('cse-chat-private-message', this.props.info.name);
        }
    }]);

    return User;
}(React.Component);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = User;