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
var camelot_unchained_2 = require('camelot-unchained');
var Animate = require('react-animate.css');
var raceText = {
    'HUMANMALEA': 'Through luck, or perhaps something more, a few Humans managed to escape Veilstorm influence entirely. They did not change into something else, and were untouched by the Veil’s wrath, as though chosen for a special purpose. They may lack the strange powers that some other races possess, but they are also spared the curses that sometimes accompany these powers. Through sheer determination, Humans survive. They refuse to disappear, and prosper even in the most difficult of times, following the noble path of righteous strength that King Arthur lays before them.',
    'PICT': 'A description for Picts that explains lots of cool things about them which Max still has to write for me.',
    'HUMANMALEV': 'Explorers and mighty warriors of legend, the Vikings are hungry. Hungry for battle, hungry for plunder, and starving to rule by right of conquest. They are a hard people, who wear their scars as badges of honor, and choose to live in some of the harshest lands imaginable. They will brazenly homestead in foreign territory and claim it as their own, upholding a culture that is welcoming to friends but ruthless to foes. A people of blood and steel, they will devour the Realms as masters of the sea-lanes, raiding and pillaging what they need, as they swim swiftly and their watercraft move too fast to catch. There is no place on earth the Vikings fear to tread; let the other Realms tremble at their approach.',
    'VALKYRIE': 'Though their race was born of great suffering and tragedy, the Valkyrie have risen high above their past on hidden wings of magic. Some of the Valkyrie can truly fly with their delicate wings; others glide overhead. Harsh dispensers of justice, the Valkyrie seek eternal revenge, and never forget a wrong. However, a merciful streak runs deeply through their culture, for the Valkyrie know pain and suffering well. They are serious as a rule, and none are much good at festivals, though the men of the race tend to be less quick to anger. The Valkyrie are the authors and the keepers of the Valkyric Code, the basis of law in the Viking Realm, and one of the most important documents ever written. Chanting its passages, the Valkyrie fly to ferocious battle, ever fighting to protect the Realm.',
    'HUMANMALET': 'Humans have always had a place in the courts of the Tuatha Dé Danann, whether through fairy tales of captured children, lost souls looking for the Otherworld, or simply by seeking a place of refuge in their magnificent forests. While some in other Realms, particularly their hated enemies the Cait Sith, call the Human races of the Tuatha Dé Danann “pets” of their more powerful “masters”, nothing could be further from the truth. The Human races of this Realm share the same social, political, and military status of their compatriots. Just as importantly, these humans do not share the Banes of some of their fellow races among the Tuatha Dé Danann. Then again, tales are told in quiet corners of Humans in this Realm who are not quite what they seem to be…',
    'LUCHORPAN': 'Small and often underestimated, the Luchorpán are natural-born tricksters, masters of misdirection and illusion. They believe that lies can reveal the truth, that a person’s hidden nature is revealed when they are the victim of a prank. The clever fingers of the Luchorpán are naturally skilled at powerful crafting, and their quick reflexes, excellent hiding skills, or talent for climbing often get them out of whatever trouble their mischief gets them into. If all else fails, rumor holds that Luchorpán can simply vanish and reappear elsewhere. Bonds of love are considered unbreakable among the Luchorpán, and any of them would give up life itself to defend their family or their Realm.'
};

var RaceSelect = function (_React$Component) {
    _inherits(RaceSelect, _React$Component);

    function RaceSelect(props) {
        _classCallCheck(this, RaceSelect);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(RaceSelect).call(this, props));

        _this.selectRace = function (race) {
            _this.props.selectRace(race);
        };
        _this.generateRaceContent = function (info) {
            return React.createElement("a", { key: info.id, className: 'thumb__' + camelot_unchained_1.race[info.id] + '--' + camelot_unchained_1.gender[_this.props.selectedGender] + ' ' + (_this.props.selectedRace !== null ? _this.props.selectedRace.id == info.id ? 'active' : '' : ''), onClick: _this.selectRace.bind(_this, info) });
        };
        _this.selectGender = function (gender) {
            _this.props.selectGender(gender);
            camelot_unchained_2.events.fire('play-sound', 'select');
        };
        return _this;
    }

    _createClass(RaceSelect, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            if (!this.props.races) return React.createElement("div", null, "loading races");
            var view = null;
            var text = null;
            var name = null;
            if (this.props.selectedRace) {
                name = React.createElement("h2", { className: 'display-name' }, this.props.selectedRace.name);
                view = React.createElement("div", { key: camelot_unchained_1.race[this.props.selectedRace.id] + '--' + camelot_unchained_1.gender[this.props.selectedGender], className: 'standing__' + camelot_unchained_1.race[this.props.selectedRace.id] + '--' + camelot_unchained_1.gender[this.props.selectedGender] });
                text = React.createElement("div", { className: 'selection-description' }, raceText[camelot_unchained_1.race[this.props.selectedRace.id]]);
            }
            return React.createElement("div", { className: 'page' }, React.createElement("video", { src: 'videos/' + this.props.selectedFaction.shortName + '.webm', poster: 'videos/' + this.props.selectedFaction.shortName + '-bg.jpg', autoPlay: true, loop: true }), name, React.createElement("div", { className: 'selection-box' }, React.createElement("h6", null, "Choose your race"), this.props.races.filter(function (r) {
                return r.faction === _this2.props.selectedFaction.id;
            }).map(this.generateRaceContent), React.createElement("h6", null, "Choose your gender"), React.createElement("a", { className: 'gender-btn ' + (this.props.selectedGender == camelot_unchained_1.gender.MALE ? 'selected' : ''), onClick: function onClick() {
                    return _this2.selectGender(camelot_unchained_1.gender.MALE);
                } }, "Male"), React.createElement("a", { className: 'gender-btn ' + (this.props.selectedGender == camelot_unchained_1.gender.FEMALE ? 'selected' : ''), onClick: function onClick() {
                    return _this2.selectGender(camelot_unchained_1.gender.FEMALE);
                } }, "Female"), text), React.createElement("div", { className: 'view-content' }, React.createElement(Animate, { className: 'animate', animationEnter: 'fadeIn', animationLeave: 'fadeOut', durationEnter: 400, durationLeave: 500 }, view)));
        }
    }]);

    return RaceSelect;
}(React.Component);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RaceSelect;