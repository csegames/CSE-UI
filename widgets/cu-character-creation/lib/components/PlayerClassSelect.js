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
var Animate = require('react-animate.css');
var classText = {
    'BLACKKNIGHT': 'Legend has it that the first Black Knight was the son of Arthur, sired before he became King of his Realm. The Black Knight had a falling-out with his father, and left the Realm to wander the world. After braving The Depths, he returned to Arthur’s court a changed man. On that day, he swore to forever fight by Arthur’s side. Those who join the Black Knights swear an oath to follow Arthur into battle, no matter where it takes them. They prefer to wear black clothing, a signal to the enemy that death is coming.',
    'BLACKGUARD': 'This order of archers was created by a young man named Edward. He organized a group of bowmen to defeat a “terror of Abominations” that arose from the Black Mire. They took on that tainted blight, and many horrible risks, in order to protect others. The Blackguard were among Arthur’s earliest followers, before the rebirth of magic in the world. Adopting the color black, these archers became the scourge of all enemies of the Realm.',
    'PHYSICIAN': 'To achieve their goal of being the best healers on the field of battle, members of this class use a bit more “science” than many others. The Physicians rely on a mixture of ability-enhanced potions, elixirs, and magical abilities to accomplish their goals. They also utilize a variant of the horn of Brân Galed (one of the Thirteen Treasures of Britain) to enhance their potions.',
    'MJOLNIR': 'The Mjölnir, and the first “true” hammer, were born from the collision of the two moons. New Mjölnir are entrusted with a tiny fragment from that collision, which is then used by crafters to imbue into their iconic weapon. Mjölnir are reputed to focus on causing destruction rather than on the more protective aspects of their occupation, and that’s just about right as far as they’re concerned. These men and women have a long tradition of taking their anger out on their enemies.',
    'WINTERSSHADOW': 'An adept archer, at home in the snow. A true Shadow can shoot while on skis or on foot, and they prefer yew-wood for their bows. They learn the importance of camouflage early in their training, and whole companies of Shadows have been known to sit silently in the snow for days at a time. A Shadow’s unique mastery of shields and other weapons makes them stand out from other archers. The bows of the Winter’s Shadows may not shoot the furthest, but their battle, survival, and skirmisher skills are impressive; especially for an archer.',
    'STONEHEALER': 'Only in the land of the Vikings would anyone throw rocks at people in order to heal them. While it is unfair that some claim Stonehealers are men and women who have fallen on their heads too often, it is true that being a Stonehealer does come with certain unique risks to the healers themselves. They are certainly among the most stubborn, thick-skulled defenders of the Realm!',
    'FIANNA': 'The Fianna were founded by one of the great leaders of the Tuatha Dé Danann: Fionn mac Cumhaill. This class has a very special ability, the Diord Fionn (Fionn’s war-cry), which they can use before and during battles. The mottos of this class are “Purity of our hearts, Strength of our limbs, and Deeds to match our words.” Between their war-cry and additional movement speed, they are glad to wear less heavy armor than many of their counterparts.',
    'FORESTSTALKER': 'These archers are renowned for using very powerful weapons that have a shorter range than the weapons of many of the Forest Stalkers’ counterparts. However, within their own forests their camouflage abilities are the most powerful in all the Realms. They are adept at using poison on their arrows, as well as at calling on the forest to aid them in delaying groups of invaders. One of their abilities is the power to call on trees to create arrows for them.',
    'EMPATH': 'Empaths believe that their bodies should be used to heal those in need. They pay a great price for choosing this noble way, for they take the wounds of others onto their own bodies. The more serious the wounds they deal with, the greater the likelihood that the Empath suffers additional side effects from their healing. The reward for this sacrifice is equally impressive: Empaths have access to some of the most powerful heals of all the classes in all the Realms.'
};

var PlayerClassSelect = function (_React$Component) {
    _inherits(PlayerClassSelect, _React$Component);

    function PlayerClassSelect(props) {
        _classCallCheck(this, PlayerClassSelect);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PlayerClassSelect).call(this, props));

        _this.selectClass = function (info) {
            _this.props.selectClass(info);
        };
        _this.generateClassContent = function (info) {
            return React.createElement("a", { key: info.id, className: 'thumb__' + camelot_unchained_1.archetype[info.id] + ' ' + (_this.props.selectedClass !== null ? _this.props.selectedClass.id == info.id ? 'active' : '' : ''), onClick: _this.selectClass.bind(_this, info) });
        };
        return _this;
    }

    _createClass(PlayerClassSelect, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            if (!this.props.classes) return React.createElement("div", null, " loading classes");
            var videoTitle = this.props.selectedFaction.shortName;
            var view = null;
            var text = null;
            var name = null;
            if (this.props.selectedClass) {
                name = React.createElement("h2", { className: 'display-name' }, this.props.selectedClass.name);
                view = React.createElement("div", { className: 'standing__' + camelot_unchained_1.archetype[this.props.selectedClass.id] });
                text = React.createElement("div", { className: 'selection-description' }, classText[camelot_unchained_1.archetype[this.props.selectedClass.id]]);
                switch (this.props.selectedClass.id) {
                    case camelot_unchained_1.archetype.WINTERSSHADOW:
                        videoTitle = 'class_archer';
                        break;
                    case camelot_unchained_1.archetype.FORESTSTALKER:
                        videoTitle = 'class_archer';
                        break;
                    case camelot_unchained_1.archetype.BLACKGUARD:
                        videoTitle = 'class_archer';
                        break;
                    case camelot_unchained_1.archetype.BLACKKNIGHT:
                        videoTitle = 'heavy';
                        break;
                    case camelot_unchained_1.archetype.FIANNA:
                        videoTitle = 'heavy';
                        break;
                    case camelot_unchained_1.archetype.MJOLNIR:
                        videoTitle = 'heavy';
                        break;
                    case camelot_unchained_1.archetype.PHYSICIAN:
                        videoTitle = 'healers';
                        break;
                    case camelot_unchained_1.archetype.EMPATH:
                        videoTitle = 'healers';
                        break;
                    case camelot_unchained_1.archetype.STONEHEALER:
                        videoTitle = 'healers';
                        break;
                }
            }
            return React.createElement("div", { className: 'page' }, React.createElement("video", { src: 'videos/' + videoTitle + '.webm', poster: 'videos/' + videoTitle + '.jpg', autoPlay: true, loop: true }), name, React.createElement("div", { className: 'selection-box' }, React.createElement("h6", null, "Choose your class"), this.props.classes.filter(function (c) {
                return c.faction === _this2.props.selectedFaction.id || c.faction == camelot_unchained_1.faction.FACTIONLESS;
            }).map(this.generateClassContent), text), React.createElement("div", { className: 'view-content' }, React.createElement(Animate, { className: 'animate', animationEnter: 'fadeIn', animationLeave: 'fadeOut', durationEnter: 400, durationLeave: 500 }, view)));
        }
    }]);

    return PlayerClassSelect;
}(React.Component);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PlayerClassSelect;