/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
"use strict";

var React = require('react');
function emojiNameFromText(text) {
    //case insensitive commands
    switch (text.toLowerCase()) {
        case ':angry:':
            return 'angry';
        case ':baffled:':
        case 'o.o':
            return 'baffled';
        case ':confused:':
            return 'confused';
        case ':cool:':
        case '8)':
        case '8-)':
            return 'cool';
        case ':cry:':
        case ':\'(':
        case ':qq:':
            return 'crying';
        case ':evil:':
        case '3:)':
            return 'evil';
        case ':frustrated:':
            return 'frustrated';
        case ':grin:':
            return 'grin';
        case ':happy:':
        case ':)':
        case ':-)':
            return 'happy';
        case ':hipster:':
            return 'hipster';
        case ':neutral:':
        case ':|':
        case ':-|':
            return 'neutral';
        case ':sad:':
        case ':(':
        case ':-(':
            return 'sad';
        case ':shocked:':
        case '8o':
        case '8-o':
        case ':o':
            return 'shocked';
        case ':sleepy:':
        case ':zzz:':
            return 'sleepy';
        case ':smile:':
        case ':>':
            return 'smile';
        case ':tongue:':
        case ':p':
        case ':-p':
        case ';p':
        case ';-p':
        case '8p':
        case '8-p':
            return 'tongue';
        case ':wink:':
        case ';)':
        case ';-)':
            return 'wink';
        case ':wondering:':
        case ':wonder:':
            return 'wondering';
        //add CSE custom emoticons
        case ':andrewfez:':
            return 'andrewfez';
        case ':jbhead:':
        case ':jb:':
            return 'jbhead';
        case ':markhead:':
        case ':mj:':
        case ':mark:':
            return 'markhead';
        case ':mjelf:':
            return 'mjelf';
        case ':sandragrin:':
            return 'sandragrin';
        case ':timhead:':
            return 'timhead';
        case ':tinymichelle:':
            return 'tinymichelle';
        case ':batgrin:':
            return 'batgrin';
        case ':bathappy:':
            return 'bathappy';
        case ':batmad:':
            return 'batmad';
        case ':batsad:':
            return 'batsad';
        case ':battongue:':
            return 'battongue';
        case ':bob:':
            return 'bob';
        case ':boblove:':
            return 'boblove';
        case ':crown:':
            return 'crown';
        case ':cupotears:':
        case ':qqcup:':
            return 'cupotears';
        case ':dragonlick:':
            return 'dragonlick';
        case ':dragonwhale:':
            return 'dragonwhale';
        case ':duck:':
            return 'duck';
        case ':duckmage:':
            return 'duckmage';
        case ':frownstrm:':
        case ':sadstrm:':
            return 'frownstrm';
        case ':happystrm:':
            return 'happystrm';
        case ':judgingduckone:':
        case ':judgingduck1:':
            return 'judgingduckone';
        case ':judgingducktwo:':
        case ':judgingduck2:':
            return 'judgingducktwo';
        case ':arthurianlove:':
        case ':artlove:':
            return 'arthurianlove';
        case ':tuathalove:':
        case ':tddlove:':
            return 'tuathalove';
        case ':vikinglove:':
        case ':viklove:':
            return 'vikinglove';
        case ':plusten:':
        case ':plus10:':
            return 'plusten';
        case ':pvp:':
            return 'pvp';
        case ':rage:':
            return 'rage';
        case ':salt:':
            return 'salt';
        case ':arthurianshield:':
        case ':artshield:':
            return 'arthurianshield';
        case ':tuathashield:':
        case ':tddshield:':
            return 'tuathashield';
        case ':vikingshield:':
        case ':vikshield:':
            return 'vikingshield';
        case ':shotsfired:':
            return 'shotsfired';
        case ':unicorn:':
            return 'unicorn';
    }
    //case sensitive commands
    switch (text) {
        case ':D':
        case ':-D':
            return 'grin';
        case '-_-zzZ':
        case '(-_-)zzZ':
            return 'sleepy';
    }
    return null;
}
function fromText(text, keygen) {
    var emoji = emojiNameFromText(text);
    if (emoji) {
        return [React.createElement("span", { key: keygen(), className: 'chat-emoticon emote-' + emoji })];
    }
}
function createRegExp() {
    return (/:[a-zA-Z0-9]+:|[3]*[;:8][-']*[()@oO#$*pPD/|><]|\([6aAhH]\)|-_-zzZ|\(-_-\)zzZ|[oO]\.[oO]/g
    );
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    fromText: fromText,
    createRegExp: createRegExp
};