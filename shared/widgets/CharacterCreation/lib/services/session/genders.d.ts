/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { gender } from 'camelot-unchained';
export declare function selectGender(selected: gender): {
    type: string;
    selected: gender;
};
export default function reducer(state?: gender, action?: any): any;
