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
var camelot_unchained_1 = require('camelot-unchained');
var Animate = camelot_unchained_1.components.Animate;
var ChatDisplay_1 = require('./ChatDisplay');

var Settings = function (_React$Component) {
    _inherits(Settings, _React$Component);

    function Settings(props) {
        _classCallCheck(this, Settings);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Settings).call(this, props));

        _this.generateSection = function (sectionName) {
            if (sectionName == '') return null;
            return React.createElement("div", { key: sectionName, className: 'fly-out' }, React.createElement(ChatDisplay_1.default, null));
        };
        _this.navigate = function (sectionName) {
            var name = _this.state.sectionName == sectionName ? '' : sectionName;
            _this.setState({
                section: _this.generateSection(name),
                sectionName: name,
                checked: _this.state.checked
            });
        };
        _this.onChecked = function (id) {
            _this.setState({
                section: _this.state.section,
                sectionName: _this.state.sectionName,
                checked: !_this.state.checked
            });
        };
        _this.state = {
            section: null,
            sectionName: '',
            checked: true
        };
        return _this;
    }

    _createClass(Settings, [{
        key: 'render',
        value: function render() {
            var flyout = this.state.section;
            return React.createElement("div", { className: 'chat-settings-menu' }, React.createElement("ul", { className: 'chat-settings-list' }, React.createElement("li", { onClick: this.navigate.bind(this, 'chat-display'), key: 1 }, "Chat Display", React.createElement("br", null), React.createElement("i", null, "Change what you see in the chatbox.")), React.createElement("li", { onClick: this.navigate.bind(this, ''), key: 2 }, "Rooms", React.createElement("br", null), React.createElement("i", null, "Available rooms & autojoin settings."))), React.createElement(Animate, { animationEnter: 'slideInLeft', animationLeave: 'slideOutLeft', durationEnter: 300, durationLeave: 300 }, flyout));
        }
    }]);

    return Settings;
}(React.Component);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Settings;