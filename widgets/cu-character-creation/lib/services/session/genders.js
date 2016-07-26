/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
"use strict";

var camelot_unchained_1 = require('camelot-unchained');
var SELECT_GENDER = 'cu-character-creation/genders/SELECT_GENDER';
function selectGender(selected) {
    return {
        type: SELECT_GENDER,
        selected: selected
    };
}
exports.selectGender = selectGender;
var initialState = camelot_unchained_1.gender.MALE;
function reducer() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
    var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    switch (action.type) {
        case SELECT_GENDER:
            return action.selected;
        default:
            return state;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = reducer;