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

var UsersState = function UsersState() {
    _classCallCheck(this, UsersState);
};

exports.UsersState = UsersState;

var UsersProps = function UsersProps() {
    _classCallCheck(this, UsersProps);
};

exports.UsersProps = UsersProps;

var Users = function (_React$Component) {
    _inherits(Users, _React$Component);

    function Users(props) {
        _classCallCheck(this, Users);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Users).call(this, props));
    }

    _createClass(Users, [{
        key: "render",
        value: function render() {
            return React.createElement("div", { className: "chat-tab-content chat-users" }, this.props.room.users);
        }
    }]);

    return Users;
}(React.Component);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Users;