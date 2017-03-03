/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {Gender} from 'camelot-unchained';

const SELECT_GENDER = 'cu-character-creation/genders/SELECT_GENDER';
const RESET_GENDER = 'cu-character-creation/geners/RESET_GENDER';

export function selectGender(selected: Gender) {
    return {
        type: SELECT_GENDER,
        selected: selected
    }
}

export function resetGender() {
    return {
        type: RESET_GENDER,
    };
}

const initialState = Gender.Male;

export default function reducer(state: Gender = initialState, action: any = {}) {
    switch(action.type) {
        case RESET_GENDER: return initialState;
        case SELECT_GENDER:
            return action.selected;
        default: return state;
    }
}
