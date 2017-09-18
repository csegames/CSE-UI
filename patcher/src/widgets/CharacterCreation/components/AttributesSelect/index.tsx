/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';

import {Race, Gender, Archetype} from 'camelot-unchained';
import {AttributeInfo, attributeType} from '../../services/session/attributes';
import {AttributeOffsetInfo} from '../../services/session/attributeOffsets';
import {events} from 'camelot-unchained';

import AttributeRow from './AttributeRow';


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
  }

  public render() {
    if (typeof (this.props.attributes) === 'undefined') {
      return <div> loading attributes </div>;
    }
    let offset = this.props.attributeOffsets.find((o: AttributeOffsetInfo) => o.gender === this.props.selectedGender &&
      o.race === this.props.selectedRace);
    if (typeof offset === 'undefined') offset = null;

    const sortedAttributes = this.props.attributes.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    const primaries = sortedAttributes.filter((a: AttributeInfo) => a.type === attributeType.PRIMARY);
    const secondaries = sortedAttributes.filter((a: AttributeInfo) => a.type === attributeType.SECONDARY);
    const derived = sortedAttributes.filter((a: AttributeInfo) => a.type === attributeType.DERIVED);

    return (
      <div className='page'>
        <video src={`videos/paper-bg.webm`} poster={`videos/paper-bg.jpg`} autoPlay loop></video>
        <div className='selection-box'>
          <h6>Distribute attribute points  <span className='points'>(Remaining {this.props.remainingPoints})</span></h6>
          {sortedAttributes.map((a: AttributeInfo) =>
            <AttributeRow
              attributeInfo={a}
              offset={offset}
              selectedClass={this.props.selectedClass}
              allocatePoint={this.props.allocatePoint}
              remainingPoints={this.props.remainingPoints}
            />,
          )}
        </div>
        <div className='view-content row attributes-view'>
          <div className='col s12'>
            <h4>Primary</h4>
            {primaries.map((a: AttributeInfo) => {
              const offsetValue = offset == null ? 0 : typeof offset.attributeOffsets[a.name] === 'undefined' ? 0 :
                offset.attributeOffsets[a.name];
              return this.generateAttributeView(a, a.baseValue + a.allocatedPoints + offsetValue);
            })}
            <div className='row'>
              <h4>Secondary</h4>
              {secondaries.map((a: AttributeInfo) => {
                const offsetValue = offset == null ? 0 : typeof offset.attributeOffsets[a.name] === 'undefined' ? 0 :
                  offset.attributeOffsets[a.name];
                return this.generateAttributeView(a, a.baseValue + offsetValue);
              })}
            </div>
            
            <div className='row'>
              <h4>Derived</h4>
              {derived.map((a: AttributeInfo) => {
                return this.generateAttributeView(a, this.calculateDerivedValue(a, offset));
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  public componentWillMount() {

  }

  public componentWillUnmount() {

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
