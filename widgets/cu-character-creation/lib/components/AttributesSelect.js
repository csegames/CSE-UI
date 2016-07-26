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
var attributes_1 = require('../services/session/attributes');
var camelot_unchained_1 = require('camelot-unchained');

var AttributesSelect = function (_React$Component) {
    _inherits(AttributesSelect, _React$Component);

    function AttributesSelect(props) {
        _classCallCheck(this, AttributesSelect);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AttributesSelect).call(this, props));

        _this.increaseAttribute = function (attributeName) {
            _this.props.allocatePoint(attributeName, 1);
            camelot_unchained_1.events.fire('play-sound', 'select');
        };
        _this.decreaseAttribute = function (attributeName) {
            _this.props.allocatePoint(attributeName, -1);
            camelot_unchained_1.events.fire('play-sound', 'select');
        };
        _this.generateAttributeContent = function (attributeInfo, offset) {
            if (attributeInfo.type !== attributes_1.attributeType.PRIMARY) return null;
            var allocatedCount = 0; //this.props.allocations[attributeInfo.name]
            var offsetValue = offset == null ? 0 : typeof offset.attributeOffsets[attributeInfo.name] === 'undefined' ? 0 : offset.attributeOffsets[attributeInfo.name];
            return React.createElement("div", { key: attributeInfo.name, className: 'attribute-row' }, React.createElement("span", null, attributeInfo.name, " "), React.createElement("button", { className: 'rightarrow right', onClick: function onClick() {
                    return _this.increaseAttribute(attributeInfo.name);
                } }), React.createElement("span", { className: 'attribute-points right' }, attributeInfo.baseValue + attributeInfo.allocatedPoints + offsetValue), React.createElement("button", { className: 'leftarrow right', onClick: function onClick() {
                    return _this.decreaseAttribute(attributeInfo.name);
                } }));
        };
        _this.generateAttributeView = function (info, value) {
            var stringValue = value.toFixed(4);
            switch (info.units.toLowerCase()) {
                case 'units':
                    stringValue = value.toString();
                    break;
                case 'units/second':
                    stringValue = value.toFixed(4) + '/s';
                    break;
                case 'years':
                    stringValue = Math.floor(value) + ' years';
                    break;
                case 'percent':
                    stringValue = value.toFixed(1) + '%';
                    break;
                case 'degrees celsius':
                    stringValue = value.toFixed(1) + ' °C';
                    break;
                case 'kilograms':
                    stringValue = value.toFixed(1) + ' kg';
                    break;
                case 'meters':
                    stringValue = value.toFixed(1) + ' m';
                    break;
                case 'meters/second':
                    stringValue = value.toFixed(1) + ' m/s';
                    break;
                default:
                    stringValue = value.toFixed(4);
            }
            return React.createElement("div", { key: info.name, className: 'attribute-row row' }, React.createElement("div", { className: 'col s2 attribute-header' }, React.createElement("div", { className: 'col s8 attribute-header-name' }, info.name), React.createElement("div", { className: 'col s4 attribute-header-value' }, stringValue)), React.createElement("div", { className: 'col s10 attribute-description' }, info.description));
        };
        _this.calculateDerivedValue = function (derivedInfo, offset) {
            console.log(derivedInfo);
            var primaryInfo = _this.props.attributes.find(function (a) {
                return a.name == derivedInfo.derivedFrom;
            });
            console.log(primaryInfo);
            var primaryOffsetValue = offset == null ? 0 : typeof offset.attributeOffsets[primaryInfo.name] === 'undefined' ? 0 : offset.attributeOffsets[primaryInfo.name];
            var primaryValue = primaryInfo.baseValue + primaryInfo.allocatedPoints + primaryOffsetValue;
            var derivedMax = derivedInfo.baseValue + derivedInfo.baseValue * derivedInfo.maxOrMultipler;
            var derived = derivedInfo.baseValue + (derivedMax - derivedInfo.baseValue) / primaryInfo.maxOrMultipler * primaryValue;
            return derived;
        };
        _this.allotments = [];
        return _this;
    }

    _createClass(AttributesSelect, [{
        key: 'componentWillMount',
        value: function componentWillMount() {}
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {}
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            if (typeof this.props.attributes === 'undefined') {
                return React.createElement("div", null, " loading attributes ");
            }
            var offset = this.props.attributeOffsets.find(function (o) {
                return o.gender == _this2.props.selectedGender && o.race == _this2.props.selectedRace;
            });
            if (typeof offset === 'undefined') offset = null;
            var primaries = this.props.attributes.filter(function (a) {
                return a.type == attributes_1.attributeType.PRIMARY;
            });
            var secondaries = this.props.attributes.filter(function (a) {
                return a.type == attributes_1.attributeType.SECONDARY;
            });
            var derived = this.props.attributes.filter(function (a) {
                return a.type == attributes_1.attributeType.DERIVED;
            });
            return React.createElement("div", { className: 'page' }, React.createElement("video", { src: 'videos/paper-bg.webm', poster: 'videos/paper-bg.jpg', autoPlay: true, loop: true }), React.createElement("div", { className: 'selection-box' }, React.createElement("h6", null, "Distribute attribute points  ", React.createElement("span", { className: 'points' }, "(Remaining ", this.props.remainingPoints, ")")), this.props.attributes.map(function (a) {
                return _this2.generateAttributeContent(a, offset);
            })), React.createElement("div", { className: 'view-content row attributes-view' }, React.createElement("div", { className: 'col s12' }, React.createElement("h4", null, "Primary"), primaries.map(function (a) {
                var offsetValue = offset == null ? 0 : typeof offset.attributeOffsets[a.name] === 'undefined' ? 0 : offset.attributeOffsets[a.name];
                return _this2.generateAttributeView(a, a.baseValue + a.allocatedPoints + offsetValue);
            }), React.createElement("div", { className: 'row' }, React.createElement("h4", null, "Secondary"), secondaries.map(function (a) {
                var offsetValue = offset == null ? 0 : typeof offset.attributeOffsets[a.name] === 'undefined' ? 0 : offset.attributeOffsets[a.name];
                return _this2.generateAttributeView(a, a.baseValue + offsetValue);
            })), React.createElement("div", { className: 'row' }, React.createElement("h4", null, "Derived"), derived.map(function (a) {
                return _this2.generateAttributeView(a, _this2.calculateDerivedValue(a, offset));
            })))));
        }
    }]);

    return AttributesSelect;
}(React.Component);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AttributesSelect;