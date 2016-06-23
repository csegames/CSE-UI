/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {gender} from 'camelot-unchained';

const SELECT_GENDER = 'cu-character-creation/genders/SELECT_GENDER';

export function selectGender(selected: gender) {
    return {
        type: SELECT_GENDER,
        selected: selected
    }
}

const initialState = gender.MALE;

export default function reducer(state: gender = initialState, action: any = {}) {
    switch(action.type) {
        case SELECT_GENDER:
            return action.selected;
        default: return state;
    }
}
