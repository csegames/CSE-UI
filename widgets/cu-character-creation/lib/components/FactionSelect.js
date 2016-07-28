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
var realmText = {
    'Arthurian': 'The Realm of King Arthur strives to be the embodiment of nobility, honesty, and righteous strength. They believe they are destined to save the world, not purely through conquest but through virtue and greatness of spirit. The Realm of Arthur accepts all who would better the world through integrity, and strong characters are always welcome to find a home here. The Arthurian Edicts ensure that no one is excluded from the march to a bright future for the Realm, so long as they follow a pure nobility of purpose. Some may say the Arthurians are self-righteous and obsessive, but in the Realm of Arthur they know the truth: Honor and devotion will unite us under an Arthurian Camelot once again.',
    'Viking': 'The Realm of the Vikings follows the path of blood and steel to greatness. In the tall peaks of windswept ice they make their homes, waiting for the moment to conquer the lands below. Sigurd the Dragonslayer leads a Realm whose warriors claim to be the most fearless in the world. Across the war-torn fields the Vikings shout their famous battlecry: “How long can a Viking fight? All the day and through the night!” Fierce and determined to survive against all odds, the Viking Realm wields the storm within as a weapon to fight the storms without. Some may hold the Vikings as coarse barbarians, but in the Realm of the Mountains, they know these naysayers lack courage and conviction: Only through the forge of bloody conquest can the Realms be united to stand against the coming storms.',
    'TDD': 'The Realm of the Tuatha Dé Danann strives to become one with nature. They revere the forest for its fierce beauty and its unyielding grip on life. The forest is more than the home of the Tuatha Dé Danann; it is their deep-rooted mother, their broad-boughed father, and their protector. Beneath the green-on-green canopy of the ever-living forest, dark secrets and powerful mysteries are hidden, which every member of the Realm will fight to defend. The wise and enigmatic Lugh leads the Tuatha Dé Danann to blossoming power, expanding the reach of limitless life. Some may jest that the Tuatha Dé Danann are foolish tree-lovers and frivolous fairies, but in the Realm of the Forest they know the truth: The world will be fierce and beautiful when the Realms are united under forest halls.'
};

var FactionSelect = function (_React$Component) {
    _inherits(FactionSelect, _React$Component);

    function FactionSelect(props) {
        _classCallCheck(this, FactionSelect);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FactionSelect).call(this, props));

        _this.selectFaction = function (faction) {
            _this.props.selectFaction(faction);
        };
        _this.generateFactionContent = function (info) {
            if (info.id == camelot_unchained_1.faction.FACTIONLESS) return null; // players can not be factionless!
            return React.createElement("div", { key: info.id, className: 'cu-character-creation__faction-select__' + info.shortName + ' ' + (_this.props.selectedFaction !== null ? _this.props.selectedFaction.id == info.id ? 'active' : '' : ''), onClick: _this.selectFaction.bind(_this, info) }, React.createElement("video", { src: 'videos/' + info.shortName + '.webm', poster: 'videos/' + info.shortName + '-bg.jpg', autoPlay: true, loop: true }), React.createElement("div", { className: 'cu-character-creation__faction-select__' + info.shortName + '__shield', onClick: _this.selectFaction.bind(_this, info) }), React.createElement("h4", null, info.description), React.createElement("div", { className: 'cu-character-creation__faction-select__' + info.shortName + '__description', onClick: _this.selectFaction.bind(_this, info) }, realmText[info.shortName]));
        };
        return _this;
    }

    _createClass(FactionSelect, [{
        key: 'render',
        value: function render() {
            if (!this.props.factions) {
                return React.createElement("div", null, " loading factions ");
            }
            return React.createElement("div", { className: 'cu-character-creation__faction-select' }, this.props.factions.map(this.generateFactionContent));
        }
    }]);

    return FactionSelect;
}(React.Component);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FactionSelect;