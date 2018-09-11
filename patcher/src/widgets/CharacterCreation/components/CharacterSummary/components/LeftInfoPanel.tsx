/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';
import { Race, Gender, Archetype } from '@csegames/camelot-unchained';

import { AttributeInfo, attributeType } from '../../../services/session/attributes';
import { AttributeOffsetInfo } from '../../../services/session/attributeOffsets';
import { BanesAndBoonsState } from '../../../services/session/banesAndBoons';

import AttributeView from '../../AttributesSelect/AttributeView';
import TraitsInfo from './TraitsInfo';

export const colors = {
  filterBackgroundColor: '#372F2D',
};

const Container = styled('div')`
  flex: 2;
  overflow-y: auto;
  background: linear-gradient(top left, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.8));
  padding: 10px;
`;

export interface LeftInfoPanelProps {
  attributes: AttributeInfo[];
  attributeOffsets: AttributeOffsetInfo[];
  selectedRace: Race;
  selectedGender: Gender;
  selectedClass: Archetype;
  remainingPoints: number;
  banesAndBoonsState: BanesAndBoonsState;
}

export interface LeftInfoPanelState {
}

export class LeftInfoPanel extends React.Component<LeftInfoPanelProps, LeftInfoPanelState> {
  constructor(props: LeftInfoPanelProps) {
    super(props);
    this.state = {

    };
  }

  public render() {
    let offset = this.props.attributeOffsets.find((o: AttributeOffsetInfo) => o.gender === this.props.selectedGender &&
    o.race === this.props.selectedRace);

    if (typeof offset === 'undefined') offset = null;

    const sortedAttributes = this.props.attributes.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

    const primaries = sortedAttributes.filter((a: AttributeInfo) => a.type === attributeType.PRIMARY)
      .map((a: AttributeInfo) => ({
        attributeInfo: a,
        value: (offset.attributeOffsets[a.name] || 0) + a.baseValue + a.allocatedPoints,
      }));
    const secondaries = sortedAttributes.filter((a: AttributeInfo) => a.type === attributeType.SECONDARY)
      .map((a: AttributeInfo) => ({
        attributeInfo: a,
        value: (offset.attributeOffsets[a.name] || 0) + a.baseValue,
      }));
    const derived = sortedAttributes.filter((a: AttributeInfo) => a.type === attributeType.DERIVED)
      .map((a: AttributeInfo) => ({
        attributeInfo: a,
        value: this.calculateDerivedValue(a, offset),
      }));

    return (
      <Container id='summary-panel'>
        <AttributeView title='Primary' statArray={primaries} howManyGrids={2} />
        <AttributeView title='Secondary' statArray={secondaries} howManyGrids={2} />
        <AttributeView title='Derived' statArray={derived} howManyGrids={2} />
        <TraitsInfo banesAndBoonsState={this.props.banesAndBoonsState} />
      </Container>
    );
  }

  private calculateDerivedValue = (derivedInfo: AttributeInfo, offset: AttributeOffsetInfo) => {
    const primaryInfo = this.props.attributes.find((a: AttributeInfo) => a.name === derivedInfo.derivedFrom);
    const primaryOffsetValue = offset === null ? 0 : typeof offset.attributeOffsets[primaryInfo.name] === 'undefined' ?
      0 : offset.attributeOffsets[primaryInfo.name];
    const primaryValue = primaryInfo.baseValue + primaryInfo.allocatedPoints + primaryOffsetValue;

    const derivedMax = derivedInfo.baseValue + derivedInfo.baseValue * derivedInfo.maxOrMultipler;

    const derived = derivedInfo.baseValue + (derivedMax - derivedInfo.baseValue) / primaryInfo.maxOrMultipler * primaryValue;
    return derived;
  }
}

export default LeftInfoPanel;

