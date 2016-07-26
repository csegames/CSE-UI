// Typescript conversion based on https://github.com/thiagoc7/react-animate.css
//  which is under the MIT license as indicated below
//
// The MIT License (MIT)
//
// Copyright (c) 2015 Ryan Florence
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

var Animate = function (_React$Component) {
    _inherits(Animate, _React$Component);

    function Animate() {
        var _Object$getPrototypeO;

        _classCallCheck(this, Animate);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(Animate)).call.apply(_Object$getPrototypeO, [this].concat(args)));

        _this.renderStyle = function (animationEnter, animationLeave, durationEnter, durationLeave) {
            return '\n        .default-enter {\n          opacity: 0;\n        }\n        .default-enter.' + animationEnter + ' {\n          animation-duration: ' + durationEnter / 1000 + 's;\n          animation-fill-mode: both;\n          opacity: 1;\n        }\n        .default-leave {\n          opacity: 1;\n        }\n        .default-leave.' + animationLeave + ' {\n          animation-duration: ' + durationLeave / 1000 + 's;\n          animation-fill-mode: both;\n        }\n        ';
        };
        return _this;
    }

    _createClass(Animate, [{
        key: 'render',
        value: function render() {
            var _props = this.props;
            var children = _props.children;
            var animationEnter = _props.animationEnter;
            var animationLeave = _props.animationLeave;
            var durationEnter = _props.durationEnter;
            var durationLeave = _props.durationLeave;

            return React.createElement("div", { key: this.props.key, className: '' + (this.props.className ? this.props.className : '') }, React.createElement("style", { dangerouslySetInnerHTML: { __html: this.renderStyle(animationEnter, animationLeave, durationEnter, durationLeave) } }), React.createElement(ReactCSSTransitionGroup, { component: this.props.component ? this.props.component : 'div', transitionName: {
                    enter: 'default-enter',
                    enterActive: animationEnter,
                    leave: 'default-leave',
                    leaveActive: animationLeave
                }, transitionEnterTimeout: durationEnter, transitionLeaveTimeout: durationLeave }, children));
        }
    }]);

    return Animate;
}(React.Component);

Animate.propTypes = {
    animationEnter: React.PropTypes.string.isRequired,
    animationLeave: React.PropTypes.string.isRequired,
    durationEnter: React.PropTypes.number.isRequired,
    durationLeave: React.PropTypes.number.isRequired
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Animate;