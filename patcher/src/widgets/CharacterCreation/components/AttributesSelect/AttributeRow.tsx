/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';

import { Archetype } from '@csegames/camelot-unchained';

import { AttributeInfo, attributeType } from '../../services/session/attributes';
import { AttributeOffsetInfo } from '../../services/session/attributeOffsets';
import AllocatePointButton from './AllocatePointButton';

export interface AttributeRowProps {
  attributeInfo: AttributeInfo;
  offset: AttributeOffsetInfo;
  selectedClass: Archetype;
  allocatePoint: (name: string, value: number) => void;
  remainingPoints: number;
}

export interface AttributeRowState {
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
  private initialValue: number;
  private mouseDownTimeout: any;
  private mouseDownInterval: any;

  public render() {
    const { attributeInfo, offset } = this.props;
    const isImportant = _.includes(importantAttributes[this.props.selectedClass], attributeInfo.name);

    const offsetValue = offset === null ? 0 : typeof offset.attributeOffsets[attributeInfo.name] === 'undefined' ? 0 :
      offset.attributeOffsets[attributeInfo.name];
    const disabled = this.props.remainingPoints === 0 ||
      this.initialValue === (attributeInfo.baseValue + attributeInfo.allocatedPoints + offsetValue);

    if (attributeInfo.type !== attributeType.PRIMARY) return null;
    return (
      <div key={attributeInfo.name} className={`attribute-row ${isImportant ? 'important' : ''}`}>
        <span>{attributeInfo.name}</span>
        <AllocatePointButton
          direction='right'
          onMouseDown={this.increaseAttribute}
          onMouseUp={this.clearMouseDownInterval}>
        </AllocatePointButton>
        <span className={`attribute-points right ${isImportant ? 'important' : ''} ${disabled ? 'maxmin-points' : ''}`}>
          {attributeInfo.baseValue + attributeInfo.allocatedPoints + offsetValue}
        </span>
        <AllocatePointButton
          direction='left'
          onMouseDown={this.decreaseAttribute}
          onMouseUp={this.clearMouseDownInterval}>
        </AllocatePointButton>
      </div>
    );
  }

  public componentDidMount() {
    const { offset, attributeInfo } = this.props;
    const offsetValue = offset === null ? 0 : typeof offset.attributeOffsets[attributeInfo.name] === 'undefined' ? 0 :
      offset.attributeOffsets[attributeInfo.name];
    this.initialValue = attributeInfo.baseValue + attributeInfo.allocatedPoints + offsetValue;
  }

  private increaseAttribute = () => {
    this.props.allocatePoint(this.props.attributeInfo.name, 1);

    this.mouseDownTimeout = setTimeout(() => {
      this.mouseDownInterval = setInterval(() => {
        this.props.allocatePoint(this.props.attributeInfo.name, 1);
      }, 30);
    }, 500);
  }

  private decreaseAttribute = () => {
    this.props.allocatePoint(this.props.attributeInfo.name, -1);

    this.mouseDownTimeout = setTimeout(() => {
      this.mouseDownInterval = setInterval(() => {
        this.props.allocatePoint(this.props.attributeInfo.name, -1);
      }, 30);
    }, 500);
  }

  private clearMouseDownInterval = () => {
    clearTimeout(this.mouseDownTimeout);
    clearInterval(this.mouseDownInterval);
    this.mouseDownInterval = null;
  }
}

export default AttributeRow;

