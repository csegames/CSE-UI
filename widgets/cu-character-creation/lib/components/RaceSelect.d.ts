/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as React from 'react';
import { gender } from 'camelot-unchained';
import { RaceInfo } from '../services/session/races';
import { FactionInfo } from '../services/session/factions';
export interface RaceSelectProps {
    selectedFaction: FactionInfo;
    races: Array<RaceInfo>;
    selectedRace: RaceInfo;
    selectRace: (race: RaceInfo) => void;
    selectedGender: gender;
    selectGender: (selected: gender) => void;
}
export interface RaceSelectState {
}
declare class RaceSelect extends React.Component<RaceSelectProps, RaceSelectState> {
    constructor(props: RaceSelectProps);
    selectRace: (race: RaceInfo) => void;
    generateRaceContent: (info: RaceInfo) => JSX.Element;
    selectGender: (gender: gender) => void;
    render(): JSX.Element;
}
export default RaceSelect;
