/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';

import { Race, Gender, Archetype, events } from 'camelot-unchained';
import { AttributeInfo, attributeType } from '../../services/session/attributes';
import { AttributeOffsetInfo } from '../../services/session/attributeOffsets';

import { CharacterCreationPage } from '../../index';
import AttributeRow from './AttributeRow';
import AttributeView, { AttributeObjectInfo } from './AttributeView';
import { attributeSteps } from '../HelpSteps';

export interface AttributesSelectProps {
  attributes: AttributeInfo[];
  attributeOffsets: AttributeOffsetInfo[];
  selectedRace: Race;
  selectedGender: Gender;
  selectedClass: Archetype;
  remainingPoints: number;
  allocatePoint: (name: string, value: number) => void;
}

export interface AttributesSelectState {
}

class AttributesSelect extends React.Component<AttributesSelectProps, AttributesSelectState> {
  private maxAllotments: any;
  private allotments: any;

  constructor(props: AttributesSelectProps) {
    super(props);
    this.allotments = [] as any;
    this.state = {
    };
  }

  public render() {
    if (typeof (this.props.attributes) === 'undefined') {
      return <div> loading attributes </div>;
    }
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
      <div className='page'>
        <video src={`videos/paper-bg.webm`} poster={`videos/paper-bg.jpg`} autoPlay loop></video>
        <div className='selection-box'>
          <h6>Distribute attribute points  <span className='points'>(Remaining {this.props.remainingPoints})</span></h6>
          {sortedAttributes.map((a: AttributeInfo) =>
            <AttributeRow
              key={a.name}
              attributeInfo={a}
              offset={offset}
              selectedClass={this.props.selectedClass}
              allocatePoint={this.props.allocatePoint}
              remainingPoints={this.props.remainingPoints}
            />,
          )}
        </div>
        <div className='view-content row attributes-view'>
          <div style={{ width: '100%' }} className='col s12'>
            <AttributeView title='Primary' statArray={primaries} />
            <AttributeView title='Secondary' statArray={secondaries} />
            <AttributeView title='Derived' statArray={derived} />
          </div>
        </div>
      </div>
    );
  }

  private generateAttributeView = (info: AttributeInfo, value: number) => {
    let stringValue: string = value.toFixed(4);
    switch (info.units.toLowerCase()) {
      case 'units':
        stringValue = value.toString();
        break;
      case 'units/second':
        stringValue = value.toFixed(4) + '/s';
        break;
      case 'years':
        stringValue = Math.floor(value) + ' years';
        break;
      case 'percent':
        stringValue = value.toFixed(1) + '%';
        break;
      case 'degrees celsius':
        stringValue = value.toFixed(1) + ' °C';
        break;
      case 'kilograms':
        stringValue = value.toFixed(1) + ' kg';
        break;
      case 'meters':
        stringValue = value.toFixed(1) + ' m';
        break;
      case 'meters/second':
        stringValue = value.toFixed(1) + ' m/s';
        break;
      default:
        stringValue = value.toFixed(4);
    }
    return (
      <div key={info.name} className='attribute-row row'>
        <div className='col s2 attribute-header'>
          <div className='col s8 attribute-header-name'>
            {info.name}
          </div>
          <div className='col s4 attribute-header-value'>
            {stringValue}
          </div>
        </div>
        <div className='col s10 attribute-description'>
          {info.description}
        </div>
      </div>
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

export default AttributesSelect;
