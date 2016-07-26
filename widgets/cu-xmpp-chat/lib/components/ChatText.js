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

var ChatTextState = function ChatTextState() {
    _classCallCheck(this, ChatTextState);
};

exports.ChatTextState = ChatTextState;
var AUTOSCROLL_FUZZYNESS = 12;

var ChatText = function (_React$Component) {
    _inherits(ChatText, _React$Component);

    function ChatText(props) {
        _classCallCheck(this, ChatText);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ChatText).call(this, props));

        _this.SCROLLBACK_PAGESIZE = 50;
        _this.autoScroll = true;
        _this.lazyLoadTop = null;
        _this.state = new ChatTextState();
        _this.handleScroll = _this.handleScroll.bind(_this);
        _this.handleAutoScroll = _this.handleAutoScroll.bind(_this);
        return _this;
    }

    _createClass(ChatText, [{
        key: 'autoScrollToBottom',
        value: function autoScrollToBottom() {
            var chatBox = this.refs['chatbox'];
            if (this.autoScroll && chatBox.lastElementChild) {
                chatBox.scrollTop = chatBox.scrollHeight - chatBox.offsetHeight;
            }
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            this.autoScrollToBottom();
            if (this.lazyLoadTop) {
                // after a lazy load, reposition the element that was at the top
                // back at the top
                this.lazyLoadTop.scrollIntoView(true);
                this.lazyLoadTop = undefined;
            }
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.autoScrollToBottom();
            this.registerEvents();
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.unregisterEvents();
        }
    }, {
        key: 'registerEvents',
        value: function registerEvents() {
            var el = this.refs['chatbox'];
            el.addEventListener("scroll", this.handleScroll);
            el.addEventListener("auto-scroll", this.handleAutoScroll);
        }
    }, {
        key: 'unregisterEvents',
        value: function unregisterEvents() {
            var el = this.refs['chatbox'];
            el.removeEventListener("scroll", this.handleScroll);
            el.removeEventListener("auto-scroll", this.handleAutoScroll);
        }
    }, {
        key: 'handleScroll',
        value: function handleScroll(e) {
            // auto-scroll is enabled when the scroll bar is at or very near the bottom
            var chatBox = this.refs['chatbox'];
            this.autoScroll = chatBox.scrollHeight - (chatBox.scrollTop + chatBox.offsetHeight) < AUTOSCROLL_FUZZYNESS;
            // if lazy loading is active, and we have scrolled up to where the lazy loaded
            // content should be then lazy load the next page of content
            var lazy = this.refs['lazyload'];
            if (lazy) {
                if (chatBox.scrollTop < lazy.offsetHeight) {
                    this.lazyLoadTop = lazy.nextElementSibling;
                    this.props.room.nextScrollbackPage();
                    this.forceUpdate();
                }
            }
        }
    }, {
        key: 'handleAutoScroll',
        value: function handleAutoScroll() {
            this.autoScrollToBottom();
        }
    }, {
        key: 'newRoom',
        value: function newRoom() {
            this.currentRoom = this.props.room.roomId;
            this.autoScroll = true;
        }
    }, {
        key: 'render',
        value: function render() {
            var room = this.props.room;
            var messages = void 0;
            var content = undefined;
            var lazy = undefined;
            if (room) {
                if (!this.currentRoom || !room.roomId.same(this.currentRoom)) {
                    this.newRoom();
                }
                if (room.scrollback > 0) {
                    lazy = React.createElement("div", { ref: "lazyload", className: "chat-lazyload", style: { height: room.scrollback * 1.7 + 'em' } });
                }
                if (room.messages) {
                    messages = room.messages.slice(room.scrollback);
                }
            }
            return React.createElement("div", { ref: "chatbox", className: "chat-text allow-select-text" }, lazy, messages);
        }
    }]);

    return ChatText;
}(React.Component);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChatText;