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
var ChatState_1 = require('./ChatState');
var AtUserList_1 = require('./AtUserList');
;
;

var ChatInput = function (_React$Component) {
    _inherits(ChatInput, _React$Component);

    function ChatInput(props) {
        _classCallCheck(this, ChatInput);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ChatInput).call(this, props));

        _this.tabUserList = [];
        _this.tabUserIndex = null;
        _this.sentMessages = [];
        _this.sentMessageIndex = null;
        _this.selectAtUser = function (user) {
            var input = _this.getInputNode();
            var lastWord = input.value.match(/@([\S]*)$/);
            input.value = input.value.substring(0, lastWord.index + 1) + user + ' ';
            input.focus();
            _this.setState({ atUsers: [], atUsersIndex: 0 });
        };
        _this.expand = function (input) {
            if (!_this.state.expanded) {
                (function () {
                    var was = input.offsetHeight;
                    _this.setState({ expanded: true });
                    setTimeout(function () {
                        // pass height of growth of input area as extra consideration for scroll logic
                        _this.props.scroll(input.offsetHeight - was);
                    }, 100); // queue it?
                })();
            }
        };
        _this.collapse = function () {
            _this.setState({ expanded: false });
        };
        _this.state = _this.initialState();
        _this._privateMessageHandler = camelot_unchained_1.events.on('cse-chat-private-message', function (name) {
            _this.privateMessage(name);
        });
        _this.keyDown = _this.keyDown.bind(_this);
        _this.keyUp = _this.keyUp.bind(_this);
        _this.parseInput = _this.parseInput.bind(_this);
        return _this;
    }

    _createClass(ChatInput, [{
        key: 'initialState',
        value: function initialState() {
            return {
                atUsers: [],
                atUsersIndex: 0,
                expanded: false
            };
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            if (this._privateMessageHandler) {
                camelot_unchained_1.events.off(this._privateMessageHandler);
            }
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            camelot_unchained_1.client.OnBeginChat(function (cmdKind, text) {
                _this2.getInputNode().focus();
                _this2.getInputNode().value = text;
            });
        }
    }, {
        key: 'getInputNode',
        value: function getInputNode() {
            return this.refs['new-text'];
        }
    }, {
        key: 'keyDown',
        value: function keyDown(e) {
            var _this3 = this;

            // current input field value
            var textArea = e.target;
            var value = textArea.value;
            // Complete username on tab key (9 = tab)
            if (e.keyCode === 9) {
                e.preventDefault();
                if (!this.tabUserList.length) {
                    (function () {
                        var chat = ChatState_1.chatState.get('chat');
                        var lastWord = value.match(/\b([\S]+)$/)[1];
                        var endChar = lastWord === value ? ': ' : ' ';
                        var matchingUsers = [];
                        chat.getRoom(chat.currentRoom).users.forEach(function (u) {
                            if (u.props.info.name.substring(0, lastWord.length) === lastWord) {
                                matchingUsers.push(u.props.info.name);
                            }
                        });
                        if (matchingUsers.length) {
                            _this3.tabUserList = matchingUsers;
                            _this3.tabUserIndex = 0;
                            textArea.value += matchingUsers[0].substring(lastWord.length) + endChar;
                            _this3.setState({ atUsers: [], atUsersIndex: 0 });
                        }
                    })();
                } else {
                    var oldTabIndex = this.tabUserIndex;
                    var newTabIndex = oldTabIndex + 1 > this.tabUserList.length - 1 ? 0 : oldTabIndex + 1;
                    var _endChar = value.slice(-2) === ': ' ? ': ' : ' ';
                    textArea.value = value.replace(new RegExp(this.tabUserList[oldTabIndex] + ':? $'), this.tabUserList[newTabIndex]) + _endChar;
                    this.tabUserIndex = newTabIndex;
                    this.setState({ atUsers: [], atUsersIndex: 0 });
                }
            } else {
                this.tabUserList = [];
                this.tabUserIndex = null;
            }
            // Handle up-arrow (38)
            if (e.keyCode === 38) {
                e.preventDefault();
                if (this.state.atUsers.length > 0) {
                    // If list of @users is displayed, arrow keys should navigate that list
                    var newIndex = this.state.atUsersIndex - 1 === -1 ? this.state.atUsers.length - 1 : this.state.atUsersIndex - 1;
                    this.setState({ atUsers: this.state.atUsers, atUsersIndex: newIndex });
                } else {
                    // No lists are visible, arrow keys should navigate sent message history
                    if (this.sentMessages.length > 0) {
                        if (this.sentMessageIndex === null) {
                            this.sentMessageIndex = this.sentMessages.length - 1;
                        } else {
                            this.sentMessageIndex = this.sentMessageIndex - 1 === -1 ? 0 : this.sentMessageIndex - 1;
                        }
                        textArea.value = this.sentMessages[this.sentMessageIndex];
                    }
                }
            }
            // Handle down-arrow (40)
            if (e.keyCode === 40) {
                e.preventDefault();
                if (this.state.atUsers.length > 0) {
                    // If list of @users is displayed, arrow keys should navigate that list
                    var _newIndex = this.state.atUsersIndex + 1 > this.state.atUsers.length - 1 ? 0 : this.state.atUsersIndex + 1;
                    this.setState({ atUsers: this.state.atUsers, atUsersIndex: _newIndex });
                } else {
                    // No lists are visible, arrow keys should navigate sent message history
                    if (this.sentMessageIndex !== null) {
                        this.sentMessageIndex = this.sentMessageIndex + 1 > this.sentMessages.length - 1 ? null : this.sentMessageIndex + 1;
                    }
                    textArea.value = this.sentMessageIndex ? this.sentMessages[this.sentMessageIndex] : '';
                }
            }
            // Send message on enter key (13 = enter)
            if (e.keyCode === 13) {
                if (e.shiftKey) {
                    // Shift+ENTER = insert ENTER into text, and expand text area
                    this.expand(e.target);
                } else if (!e.ctrlKey && !e.altKey) {
                    // just ENTER
                    e.preventDefault();
                    if (this.state.atUsers.length > 0) {
                        // complete @name expansion
                        this.selectAtUser(this.state.atUsers[this.state.atUsersIndex]);
                    } else {
                        // Send message on enter key (13)
                        this.send();
                        this.collapse();
                        this.getInputNode().blur();
                    }
                }
            }
        }
    }, {
        key: 'keyUp',
        value: function keyUp(e) {
            var textArea = e.target;
            // if user deletes all the content, shrink the input area again
            var value = textArea.value;
            if (value.length === 0) {
                this.collapse();
            }
            // if the user types a line that wraps and causes the text area to
            // scroll and we are not currently expanded, then expand.
            if (textArea.scrollHeight > textArea.offsetHeight && !this.state.expanded) {
                this.expand(textArea);
            }
        }
    }, {
        key: 'parseInput',
        value: function parseInput(e) {
            var textArea = e.target;
            // Handle @name completion
            var lastWord = textArea.value.match(/(?:^|\s)@([\S]*)$/);
            var userList = [];
            var userFilter = lastWord && lastWord[1] ? lastWord[1] : '';
            if (lastWord) {
                var chat = ChatState_1.chatState.get('chat');
                chat.getRoom(chat.currentRoom).users.forEach(function (u) {
                    if (userFilter.length === 0 || u.props.info.name.toLowerCase().indexOf(userFilter.toLowerCase()) !== -1) {
                        userList.push(u.props.info.name);
                    }
                });
                userList.sort();
            }
            this.setState({ atUsers: userList, atUsersIndex: this.state.atUsersIndex });
        }
    }, {
        key: 'send',
        value: function send() {
            var input = this.getInputNode();
            var value = input.value;
            // remove leading space (not newline) and trailing white space
            while (value[0] === ' ') {
                value = value.substr(1);
            }while (value[value.length - 1] === '\n') {
                value = value.substr(0, value.length - 1);
            }if (value[0] !== '/' || !this.props.slashCommand(value.substr(1))) {
                // not a recognised / command, send it
                this.props.send(value);
            }
            // add message to temporary history
            this.sentMessageIndex = null;
            if (value) {
                this.sentMessages.push(value);
                if (this.sentMessages.length > 25) this.sentMessages.shift();
            }
            // reset input field after sending message
            input.value = '';
            input.focus();
        }
    }, {
        key: 'privateMessage',
        value: function privateMessage(name) {
            var input = this.getInputNode();
            input.value = '/w ' + name + ' ';
            input.focus();
        }
    }, {
        key: 'render',
        value: function render() {
            var inputClass = ['chat-input', 'input-field', 'chat-' + (this.state.expanded ? 'expanded' : 'normal')];
            return React.createElement("div", { className: inputClass.join(' ') }, React.createElement(AtUserList_1.default, { users: this.state.atUsers, selectedIndex: this.state.atUsersIndex, selectUser: this.selectAtUser }), React.createElement("label", { htmlFor: "chat-text" }, "Say something!"), React.createElement("textarea", { className: "materialize-textarea", id: "chat-text", ref: "new-text", onBlur: function onBlur() {
                    return camelot_unchained_1.client.ReleaseInputOwnership();
                }, onFocus: function onFocus() {
                    return camelot_unchained_1.client.RequestInputOwnership();
                }, onKeyDown: this.keyDown, onKeyUp: this.keyUp, onChange: this.parseInput }));
        }
    }]);

    return ChatInput;
}(React.Component);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChatInput;