/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var internalId = 0;

var Listener = function Listener(topic, once, callback) {
    _classCallCheck(this, Listener);

    this.fired = 0;
    this.last = 0;
    this.topic = topic;
    this.once = once;
    this.callback = callback;
    this.id = ++internalId;
};

var EventEmitter = function () {
    function EventEmitter() {
        var _this = this;

        _classCallCheck(this, EventEmitter);

        /**
         * diagnostics() - dump data to console.log
         */
        this.diagnostics = function () {
            for (var key in _this.events) {
                if (_this.events.hasOwnProperty(key)) {
                    var listeners = _this.events[key];
                    listeners.forEach(function (listener, index) {
                        if (listener) {
                            console.log('Event:' + ' topic ' + listener.topic + ' index ' + index + ' ID ' + listener.id + ' once ' + listener.once + ' callback ' + _typeof(listener.callback) + ' fired ' + listener.fired + ' last ' + new Date(listener.last).toISOString());
                        } else {
                            console.log('Event: Index ' + index + ' is free (null)');
                        }
                    });
                }
            }
        };
        this.events = {};
    }
    /**
     * addListener() is called to register a listener for a topic.
     *
     * @param topic {string}         Topic name
     * @param once {boolean}         Fire event only once (auto-unregister) [optional]
     * @param callback {function}    Handler to call when topic is fired
     */


    _createClass(EventEmitter, [{
        key: 'addListener',
        value: function addListener(topic) {
            var once = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
            var callback = arguments[2];

            var listeners = this.events[topic] = this.events[topic] || [];
            var listener = new Listener(topic, once, callback);
            var i = listeners.indexOf(null);
            if (i === -1) {
                listeners.push(listener);
            } else {
                listeners[i] = listener;
            }
            return listener;
        }
        /**
         * on() is called to register a listener for a topic.
         *
         * @param topic {string}         Topic name
         * @param callback {function}    Handler to call when topic is fired
         */

    }, {
        key: 'on',
        value: function on(topic, callback) {
            return this.addListener(topic, false, callback);
        }
        /**
         * listenOnce() is called to register a listener for a topic that will
         * fire only once before being auto-removed.
         *
         * @param topic {string}         Topic name
         * @param callback {function}    Handler to call when topic is fired
         */

    }, {
        key: 'listenOnce',
        value: function listenOnce(topic, callback) {
            return this.addListener(topic, true, callback);
        }
        /**
         * removeListener() is called to deregister an existing listener
         *
         * @param listener {any}   Handle returned by previous call to addListener()
         */

    }, {
        key: 'removeListener',
        value: function removeListener(listener) {
            var listeners = this.events[listener.topic];
            if (listeners && listeners.length) {
                for (var i = 0; i < listeners.length; i++) {
                    if (listeners[i] && listeners[i].id === listener.id) {
                        listeners[i] = null;
                        return;
                    }
                }
            }
        }
        /**
         * emit() is called to pass the supplied data to the registered handlers for the topic
         *
         * @param topic {string}         Topic name
         * @param data {any}  The data being passed (depends on topic)
         */

    }, {
        key: 'emit',
        value: function emit(topic, data) {
            var listeners = this.events[topic];
            if (listeners && listeners.length) {
                for (var i = 0; i < listeners.length; i++) {
                    if (listeners[i]) {
                        var listener = listeners[i];
                        if (listener.once) {
                            listeners[i] = null;
                        }
                        listener.last = Date.now();
                        listener.fired++;
                        listener.callback(data);
                    }
                }
            }
        }
    }]);

    return EventEmitter;
}();

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EventEmitter;