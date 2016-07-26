/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as React from 'react';
import { FactionInfo } from '../services/session/factions';
export interface FactionSelectProps {
    factions: Array<FactionInfo>;
    selectedFaction: FactionInfo;
    selectFaction: (faction: FactionInfo) => void;
}
export interface FactionSelectState {
}
declare class FactionSelect extends React.Component<FactionSelectProps, FactionSelectState> {
    constructor(props: FactionSelectProps);
    selectFaction: (faction: FactionInfo) => void;
    generateFactionContent: (info: FactionInfo) => JSX.Element;
    render(): JSX.Element;
}
export default FactionSelect;
