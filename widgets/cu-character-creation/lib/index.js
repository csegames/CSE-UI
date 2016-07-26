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

require('es6-promise');
require('isomorphic-fetch');
var React = require('react');
var redux_1 = require('redux');
var react_redux_1 = require('react-redux');
var thunk = require('redux-thunk').default;
var camelot_unchained_1 = require('camelot-unchained');
var FactionSelect_1 = require('./components/FactionSelect');
var PlayerClassSelect_1 = require('./components/PlayerClassSelect');
var RaceSelect_1 = require('./components/RaceSelect');
var AttributesSelect_1 = require('./components/AttributesSelect');
var Animate = require('react-animate.css');
var reducer_1 = require('./services/session/reducer');
var races_1 = require('./services/session/races');
var factions_1 = require('./services/session/factions');
var playerClasses_1 = require('./services/session/playerClasses');
var attributes_1 = require('./services/session/attributes');
var attributeOffsets_1 = require('./services/session/attributeOffsets');
var character_1 = require('./services/session/character');
var genders_1 = require('./services/session/genders');
var store = redux_1.createStore(reducer_1.default, redux_1.applyMiddleware(thunk));
function select(state) {
    return {
        racesState: state.races,
        playerClassesState: state.playerClasses,
        factionsState: state.factions,
        attributesState: state.attributes,
        attributeOffsetsState: state.attributeOffsets,
        gender: state.gender,
        characterState: state.character
    };
}
(function (pages) {
    pages[pages["FACTION_SELECT"] = 0] = "FACTION_SELECT";
    pages[pages["RACE_SELECT"] = 1] = "RACE_SELECT";
    pages[pages["CLASS_SELECT"] = 2] = "CLASS_SELECT";
    pages[pages["ATTRIBUTES"] = 3] = "ATTRIBUTES";
})(exports.pages || (exports.pages = {}));
var pages = exports.pages;

var CharacterCreation = function (_React$Component) {
    _inherits(CharacterCreation, _React$Component);

    function CharacterCreation(props) {
        _classCallCheck(this, CharacterCreation);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CharacterCreation).call(this, props));

        _this.create = function () {
            // validate name
            var modelName = _this.refs['name-input'].value.trim();
            var normalName = modelName.replace(/[^a-zA-Z]/g, '').toLowerCase();
            var errors = [];
            if (normalName.length < 2 || modelName.length > 20) errors.push('A character name must be between 2 and 20 characters in length.');
            if (modelName.search(/^[a-zA-Z]/) === -1) errors.push('A character name must begin with a letter.');
            if (modelName.search(/[\-'][\-']/) > -1) errors.push('A character name must not contain two or more consecutive hyphens (-) or apostrophes (\').');
            if (modelName.search(/^[a-zA-Z\-']+$/) === -1) errors.push('A character name must only contain the letters A-Z, hyphens (-), and apostrophes (\').');
            if (errors.length > 0) {
                errors.forEach(function (e) {
                    return Materialize.toast(e, 5000);
                });
            } else {
                // try to create...
                var model = {
                    name: modelName,
                    race: _this.props.racesState.selected.id,
                    gender: _this.props.gender,
                    faction: _this.props.factionsState.selected.id,
                    archetype: _this.props.playerClassesState.selected.id,
                    shardID: _this.props.shard,
                    attributes: _this.props.attributesState.attributes.reduce(function (acc, cur) {
                        if (cur.type !== attributes_1.attributeType.PRIMARY) return acc;
                        if (typeof acc.name !== 'undefined') {
                            var name = acc.name;
                            var val = acc.allocatedPoints;
                            acc = {};
                            acc[name] = val;
                        }
                        if (typeof acc[cur.name] === 'undefined' || isNaN(acc[cur.name])) {
                            acc[cur.name] = cur.allocatedPoints;
                        } else {
                            acc[cur.name] += cur.allocatedPoints;
                        }
                        return acc;
                    })
                };
                _this.props.dispatch(character_1.createCharacter(model, _this.props.apiKey, _this.props.apiHost, _this.props.shard, _this.props.apiVersion));
                camelot_unchained_1.events.fire('play-sound', 'select');
            }
        };
        _this.factionSelect = function (selected) {
            _this.props.dispatch(factions_1.selectFaction(selected));
            var factionRaces = _this.props.racesState.races.filter(function (r) {
                return r.faction == selected.id;
            });
            var factionClasses = _this.props.playerClassesState.playerClasses.filter(function (c) {
                return c.faction == selected.id;
            });
            _this.props.dispatch(playerClasses_1.selectPlayerClass(factionClasses[0]));
            _this.props.dispatch(races_1.selectRace(factionRaces[0]));
            // reset race & class if they are not of the selected faction
            if (_this.props.racesState.selected && _this.props.racesState.selected.faction != selected.id) {
                _this.props.dispatch(races_1.selectRace(null));
                _this.props.dispatch(playerClasses_1.selectPlayerClass(null));
            }
            camelot_unchained_1.events.fire('play-sound', 'select');
        };
        _this.factionNext = function () {
            if (_this.props.factionsState.selected == null) {
                Materialize.toast('Choose a faction to continue.', 3000);
                return;
            }
            var factionRaces = _this.props.racesState.races.filter(function (r) {
                return r.faction == _this.props.factionsState.selected.id;
            });
            var factionClasses = _this.props.playerClassesState.playerClasses.filter(function (c) {
                return c.faction == _this.props.factionsState.selected.id;
            });
            _this.props.dispatch(playerClasses_1.selectPlayerClass(factionClasses[0]));
            _this.props.dispatch(races_1.selectRace(factionRaces[0]));
            _this.setState({ page: _this.state.page + 1 });
            camelot_unchained_1.events.fire('play-sound', 'select');
        };
        _this.raceSelect = function (selected) {
            _this.props.dispatch(races_1.selectRace(selected));
            camelot_unchained_1.events.fire('play-sound', 'select');
        };
        _this.raceNext = function () {
            if (_this.props.racesState.selected == null) {
                Materialize.toast('Choose a race to continue.', 3000);
                return;
            }
            if (_this.props.gender == 0) {
                Materialize.toast('Choose a gender to continue.', 3000);
                return;
            }
            _this.setState({ page: _this.state.page + 1 });
            camelot_unchained_1.events.fire('play-sound', 'select');
        };
        _this.classSelect = function (selected) {
            _this.props.dispatch(playerClasses_1.selectPlayerClass(selected));
            camelot_unchained_1.events.fire('play-sound', 'select');
        };
        _this.classNext = function () {
            if (_this.props.playerClassesState.selected == null) {
                Materialize.toast('Choose a class to continue.', 3000);
                return;
            }
            _this.setState({ page: _this.state.page + 1 });
            camelot_unchained_1.events.fire('play-sound', 'select');
        };
        _this.previousPage = function () {
            _this.setState({ page: _this.state.page - 1 });
            camelot_unchained_1.events.fire('play-sound', 'select');
        };
        _this.state = { page: pages.FACTION_SELECT };
        return _this;
    }

    _createClass(CharacterCreation, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.props.dispatch(attributes_1.resetAttributes());
            this.props.dispatch(character_1.resetCharacter());
            this.props.dispatch(factions_1.fetchFactions(this.props.apiHost, this.props.shard, this.props.apiVersion));
            this.props.dispatch(races_1.fetchRaces(this.props.apiHost, this.props.shard, this.props.apiVersion));
            this.props.dispatch(playerClasses_1.fetchPlayerClasses(this.props.apiHost, this.props.shard, this.props.apiVersion));
            this.props.dispatch(attributes_1.fetchAttributes(this.props.apiHost, this.props.shard, this.props.apiVersion));
            this.props.dispatch(attributeOffsets_1.fetchAttributeOffsets(this.props.apiHost, this.props.shard, this.props.apiVersion));
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            if (this.props.characterState.success) {
                this.props.created(this.props.characterState.created);
                this.props.dispatch(attributes_1.resetAttributes());
                this.props.dispatch(character_1.resetCharacter());
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var content = null;
            var next = null;
            var back = null;
            var name = null;
            switch (this.state.page) {
                case pages.FACTION_SELECT:
                    content = React.createElement(FactionSelect_1.default, { factions: this.props.factionsState.factions, selectedFaction: this.props.factionsState.selected, selectFaction: this.factionSelect });
                    next = React.createElement("a", { className: 'cu-btn right', onClick: this.factionNext, disabled: this.state.page == pages.ATTRIBUTES }, "Next");
                    break;
                case pages.RACE_SELECT:
                    content = React.createElement(RaceSelect_1.default, { races: this.props.racesState.races, selectedRace: this.props.racesState.selected, selectRace: this.raceSelect, selectedGender: this.props.gender, selectGender: function selectGender(selected) {
                            return _this2.props.dispatch(genders_1.selectGender(selected));
                        }, selectedFaction: this.props.factionsState.selected });
                    back = React.createElement("a", { className: 'cu-btn left', onClick: this.previousPage, disabled: this.state.page == pages.FACTION_SELECT }, "Back");
                    next = React.createElement("a", { className: 'cu-btn right', onClick: this.raceNext, disabled: this.state.page == pages.ATTRIBUTES }, "Next");
                    name = React.createElement("div", { className: 'cu-character-creation__name' }, React.createElement("input", { type: 'text', ref: 'name-input', placeholder: 'Character Name' }));
                    break;
                case pages.CLASS_SELECT:
                    content = React.createElement(PlayerClassSelect_1.default, { classes: this.props.playerClassesState.playerClasses, selectedClass: this.props.playerClassesState.selected, selectClass: this.classSelect, selectedFaction: this.props.factionsState.selected });
                    back = React.createElement("a", { className: 'cu-btn left', onClick: this.previousPage, disabled: this.state.page == pages.FACTION_SELECT }, "Back");
                    next = React.createElement("a", { className: 'cu-btn right', onClick: this.classNext, disabled: this.state.page == pages.ATTRIBUTES }, "Next");
                    name = React.createElement("div", { className: 'cu-character-creation__name' }, React.createElement("input", { type: 'text', ref: 'name-input', placeholder: 'Character Name' }));
                    break;
                case pages.ATTRIBUTES:
                    content = React.createElement(AttributesSelect_1.default, { attributes: this.props.attributesState.attributes, attributeOffsets: this.props.attributeOffsetsState.offsets, selectedGender: this.props.gender, selectedRace: this.props.racesState.selected.id, allocatePoint: function allocatePoint(name, value) {
                            return _this2.props.dispatch(attributes_1.allocateAttributePoint(name, value));
                        }, remainingPoints: this.props.attributesState.maxPoints - this.props.attributesState.pointsAllocated });
                    back = React.createElement("a", { className: 'cu-btn left', onClick: this.previousPage, disabled: this.state.page == pages.FACTION_SELECT }, "Back");
                    next = React.createElement("a", { className: 'cu-btn right', onClick: this.create }, "Create");
                    name = React.createElement("div", { className: 'cu-character-creation__name' }, React.createElement("input", { type: 'text', ref: 'name-input', placeholder: 'Character Name' }));
                    break;
            }
            return React.createElement("div", { className: 'cu-character-creation' }, React.createElement("div", { className: 'cu-character-creation__content' }, content), name, React.createElement("div", { className: 'cu-character-creation__navigation' }, back, next));
        }
    }]);

    return CharacterCreation;
}(React.Component);

var ConnectedCharacterCreation = react_redux_1.connect(select)(CharacterCreation);

var Container = function (_React$Component2) {
    _inherits(Container, _React$Component2);

    function Container() {
        _classCallCheck(this, Container);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Container).apply(this, arguments));
    }

    _createClass(Container, [{
        key: 'render',
        value: function render() {
            return React.createElement("div", { id: 'cu-character-creation' }, React.createElement(react_redux_1.Provider, { store: store }, React.createElement(ConnectedCharacterCreation, { apiKey: this.props.apiKey, apiHost: this.props.apiHost, apiVersion: this.props.apiVersion, shard: this.props.shard, created: this.props.created })), React.createElement("div", { className: 'preloader' }));
        }
    }]);

    return Container;
}(React.Component);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Container;