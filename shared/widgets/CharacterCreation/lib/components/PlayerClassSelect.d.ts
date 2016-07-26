/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as React from 'react';
import { PlayerClassInfo } from '../services/session/playerClasses';
import { FactionInfo } from '../services/session/factions';
export interface PlayerClassSelectProps {
    classes: Array<PlayerClassInfo>;
    selectedClass: PlayerClassInfo;
    selectClass: (playerClass: PlayerClassInfo) => void;
    selectedFaction: FactionInfo;
}
export interface PlayerClassSelectState {
}
declare class PlayerClassSelect extends React.Component<PlayerClassSelectProps, PlayerClassSelectState> {
    constructor(props: PlayerClassSelectProps);
    selectClass: (info: PlayerClassInfo) => void;
    generateClassContent: (info: PlayerClassInfo) => JSX.Element;
    render(): JSX.Element;
}
export default PlayerClassSelect;
