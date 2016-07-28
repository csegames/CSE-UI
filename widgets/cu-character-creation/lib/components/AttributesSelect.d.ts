/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as React from 'react';
import { race, gender } from 'camelot-unchained';
import { AttributeInfo } from '../services/session/attributes';
import { AttributeOffsetInfo } from '../services/session/attributeOffsets';
export interface AttributesSelectProps {
    attributes: Array<AttributeInfo>;
    attributeOffsets: Array<AttributeOffsetInfo>;
    selectedRace: race;
    selectedGender: gender;
    remainingPoints: number;
    allocatePoint: (name: string, value: number) => void;
}
export interface AttributesSelectState {
}
declare class AttributesSelect extends React.Component<AttributesSelectProps, AttributesSelectState> {
    private maxAllotments;
    private allotments;
    constructor(props: AttributesSelectProps);
    componentWillMount(): void;
    componentWillUnmount(): void;
    increaseAttribute: (attributeName: string) => void;
    decreaseAttribute: (attributeName: string) => void;
    generateAttributeContent: (attributeInfo: AttributeInfo, offset: AttributeOffsetInfo) => JSX.Element;
    generateAttributeView: (info: AttributeInfo, value: number) => JSX.Element;
    calculateDerivedValue: (derivedInfo: AttributeInfo, offset: AttributeOffsetInfo) => number;
    render(): JSX.Element;
}
export default AttributesSelect;
