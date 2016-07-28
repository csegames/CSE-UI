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
var Tab_1 = require('./Tab');

var TabsState = function TabsState() {
    _classCallCheck(this, TabsState);
};

exports.TabsState = TabsState;

var TabsProps = function TabsProps() {
    _classCallCheck(this, TabsProps);
};

exports.TabsProps = TabsProps;

var Tabs = function (_React$Component) {
    _inherits(Tabs, _React$Component);

    function Tabs(props) {
        _classCallCheck(this, Tabs);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Tabs).call(this, props));
    }

    _createClass(Tabs, [{
        key: 'render',
        value: function render() {
            var content = [];
            var tabs = ['rooms', 'users', 'settings'];
            for (var i = 0; i < tabs.length; i++) {
                content.push(React.createElement(Tab_1.default, { key: tabs[i], id: tabs[i], select: this.props.select, selected: this.props.current === tabs[i] }));
            }
            return React.createElement("ul", { className: "chat-tabs" }, content);
        }
    }]);

    return Tabs;
}(React.Component);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Tabs;