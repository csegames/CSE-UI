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
var JoinRoomListItem_1 = require('./JoinRoomListItem');

var JoinRoomList = function (_React$Component) {
    _inherits(JoinRoomList, _React$Component);

    function JoinRoomList(props) {
        _classCallCheck(this, JoinRoomList);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(JoinRoomList).call(this, props));

        _this.componentDidMount = function () {
            document.addEventListener("mousedown", _this.onmousedown, true);
        };
        _this.componentWillUnmount = function () {
            document.removeEventListener("mousedown", _this.onmousedown, true);
        };
        _this.onmousedown = function (e) {
            var el = e.target;
            if (el.className !== 'room-name') {
                // clicked outside dropdown list, hide it
                // until the filter text changes
                _this.hidden = _this.props.filter;
                _this.forceUpdate();
            }
        };
        return _this;
    }

    _createClass(JoinRoomList, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var roomList = void 0;
            var rooms = this.props.rooms;
            var filter = this.props.filter.toLowerCase();
            var names = [];
            if (this.hidden !== filter) {
                this.hidden = undefined; // filter changed, cancel hidden
                if (rooms.length && filter.length) {
                    rooms.forEach(function (room, index) {
                        var name = room.jid.split('@')[0];
                        if (filter.length === 0 || name.toLowerCase().indexOf(filter) !== -1) {
                            names.push(React.createElement(JoinRoomListItem_1.default, { room: room, key: index, selectRoom: _this2.props.selectRoom }));
                        }
                    });
                }
            }
            return React.createElement("div", { className: "room-list-anchor", ref: "anchor", style: { display: names.length ? 'block' : 'none' } }, React.createElement("div", { className: "room-list" }, names));
        }
    }]);

    return JoinRoomList;
}(React.Component);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = JoinRoomList;