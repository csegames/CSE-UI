/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';

import { StyleSheet, css, StyleDeclaration } from 'aphrodite';
import { Archetype, events } from 'camelot-unchained';

import {AttributeInfo, attributeType} from '../../services/session/attributes';
import {AttributeOffsetInfo} from '../../services/session/attributeOffsets';

export interface AttributeRowStyle extends StyleDeclaration {
  AttributeRow: React.CSSProperties;
}

export const defaultAttributeRowStyle: AttributeRowStyle = {
  AttributeRow: {
    
  },
};

export interface AttributeRowProps {
  styles?: Partial<AttributeRowStyle>;
  attributeInfo: AttributeInfo;
  offset: AttributeOffsetInfo;
  selectedClass: Archetype;
  allocatePoint: (name: string, value: number) => void;
  remainingPoints: number;
}

export interface AttributeRowState {
  attributeValue: number;
}

export const importantAttributes = {
  [Archetype.BlackKnight]: ['Strength', 'Vitality', 'Endurance', 'Resonance', 'Dexterity', 'Agility'],
  [Archetype.Fianna]: ['Strength', 'Vitality', 'Endurance', 'Resonance', 'Dexterity', 'Agility'],
  [Archetype.Mjolnir]: ['Strength', 'Vitality', 'Endurance', 'Attunement', 'Dexterity', 'Agility'],

  [Archetype.Physician]: ['Faith', 'Vitality', 'Endurance', 'Dexterity', 'Agility'],
  [Archetype.Empath]: ['Faith', 'Vitality', 'Endurance', 'Dexterity', 'Agility'],
  [Archetype.Stonehealer]: ['Faith', 'Vitality', 'Endurance', 'Dexterity', 'Agility'],

  [Archetype.Blackguard]: ['Dexterity', 'Agility', 'Endurance', 'Vitality', 'Strength'],
  [Archetype.ForestStalker]: ['Dexterity', 'Agility', 'Endurance', 'Vitality', 'Strength'],
  [Archetype.WintersShadow]: ['Dexterity', 'Agility', 'Endurance', 'Vitality', 'Strength'],
};

export class AttributeRow extends React.Component<AttributeRowProps, AttributeRowState> {
  private mouseDownTimeout: any;
  private mouseDownInterval: any;

  constructor(props: AttributeRowProps) {
    super(props);
    this.state = {
      attributeValue: 0,
    };
  }

  public render() {
    const ss = StyleSheet.create(defaultAttributeRowStyle);
    const custom = StyleSheet.create(this.props.styles || {});
    const { attributeInfo, offset } = this.props;
    const isImportant = _.includes(importantAttributes[this.props.selectedClass], attributeInfo.name);

    if (attributeInfo.type !== attributeType.PRIMARY) return null;
    return (
      <div key={attributeInfo.name} className={`attribute-row ${isImportant ? 'important' : ''}`}>
        <span style={isImportant ? { fontWeight: 'bold' } : {}}>{attributeInfo.name} </span>
        <button
          className='rightarrow right'
          onMouseDown={() => this.increaseAttribute(attributeInfo.name)}
          onMouseUp={this.clearMouseDownInterval}>
        </button>
        <input
          className='attribute-points right'
          onBlur={() => console.log('onBlur')}
          value={this.state.attributeValue}
        />
        <button
          className='leftarrow right'
          onMouseDown={(e) => this.decreaseAttribute(e, attributeInfo)}
          onMouseUp={this.clearMouseDownInterval}>
        </button>
      </div>
    );
  }

  public componentDidMount() {
    this.initializeAttributeValue();
  }

  private increaseAttribute = (attributeName: string) => {
    this.props.allocatePoint(attributeName, 1);
    this.setState({ attributeValue: this.state.attributeValue + 1 });
    
    this.mouseDownTimeout = setTimeout(() => {
      this.mouseDownInterval = setInterval(() => {
        this.props.allocatePoint(attributeName, 1);
        this.setState({ attributeValue: this.state.attributeValue + 1 });
      }, 30);
    }, 500);
    
    if (this.props.remainingPoints !== 0) events.fire('play-sound', 'select');
  }

  private decreaseAttribute = (e: React.MouseEvent<HTMLButtonElement>, attributeInfo: AttributeInfo) => {
    this.props.allocatePoint(attributeInfo.name, -1);

    this.mouseDownTimeout = setTimeout(() => {
      this.mouseDownInterval = setInterval(() => {
        this.props.allocatePoint(attributeInfo.name, -1);
        this.setState({ attributeValue: this.state.attributeValue - 1 });
      }, 30);
    }, 500);
    if (attributeInfo.allocatedPoints !== 0) events.fire('play-sound', 'select');
  }

  private clearMouseDownInterval = () => {
    clearTimeout(this.mouseDownTimeout);
    clearInterval(this.mouseDownInterval);
    this.mouseDownInterval = null;
  }

  private initializeAttributeValue = () => {
    const { offset, attributeInfo } = this.props;
    const allocatedCount = 0; // this.props.allocations[attributeInfo.name]
    const offsetValue = offset === null ? 0 : typeof offset.attributeOffsets[attributeInfo.name] === 'undefined' ? 0 :
      offset.attributeOffsets[attributeInfo.name];

    this.setState({ attributeValue: attributeInfo.baseValue + attributeInfo.allocatedPoints + offsetValue });
  }
}

export default AttributeRow;

