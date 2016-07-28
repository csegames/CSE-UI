/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import 'es6-promise';
import 'isomorphic-fetch';
import * as React from 'react';
import { gender } from 'camelot-unchained';
import { RacesState } from './services/session/races';
import { FactionsState } from './services/session/factions';
import { PlayerClassesState } from './services/session/playerClasses';
import { AttributesState } from './services/session/attributes';
import { AttributeOffsetsState } from './services/session/attributeOffsets';
import { CharacterState, CharacterCreationModel } from './services/session/character';
export { CharacterCreationModel } from './services/session/character';
export declare enum pages {
    FACTION_SELECT = 0,
    RACE_SELECT = 1,
    CLASS_SELECT = 2,
    ATTRIBUTES = 3,
}
export interface CharacterCreationProps {
    apiKey: string;
    apiHost: string;
    apiVersion: number;
    shard: number;
    created: (character: CharacterCreationModel) => void;
    dispatch?: (action: any) => void;
    racesState?: RacesState;
    playerClassesState?: PlayerClassesState;
    factionsState?: FactionsState;
    attributesState?: AttributesState;
    attributeOffsetsState?: AttributeOffsetsState;
    gender?: gender;
    characterState?: CharacterState;
}
export interface ContainerProps {
    apiKey: string;
    apiHost: string;
    apiVersion: number;
    shard: number;
    created: (created: CharacterCreationModel) => void;
}
declare class Container extends React.Component<ContainerProps, any> {
    render(): JSX.Element;
}
export default Container;
