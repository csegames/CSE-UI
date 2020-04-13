/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';

import AllocatePointButton from './AllocatePointButton';
import { StatsSelectContext } from './StatsSelectContext';
import { StatDefinitionGQL } from 'gql/interfaces';

export interface ComponentProps {
  statDef: StatDefinitionGQL;
  value: number;
  selectedClass: Archetype;
}

export interface Props extends ComponentProps {
  remainingPoints: number;
  onAllocatePoint: (statId: string, amount: number) => void;
}

export interface State {
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

  [Archetype.FlameWarden]: ['Will', 'Attunement', 'Endurance', 'Vitality'],
  [Archetype.Druid]: ['Will', 'Attunement', 'Endurance', 'Vitality'],
  [Archetype.WaveWeaver]: ['Will', 'Attunement', 'Endurance', 'Vitality'],

  [Archetype.DarkFool]: ['Resonance', 'Agility', 'Endurance', 'Vitality'],
  [Archetype.Minstrel]: ['Resonance', 'Agility', 'Endurance', 'Vitality'],
  [Archetype.Skald]: ['Resonance', 'Agility', 'Endurance', 'Vitality'],

  [Archetype.Abbot]: ['Faith', 'Vitality', 'Will', 'Agility'],
  [Archetype.Helbound]: ['Faith', 'Vitality', 'Will', 'Agility'],
  [Archetype.BlessedCrow]: ['Faith', 'Vitality', 'Will', 'Agility'],
};

export class StatRow extends React.Component<Props, State> {
  private mouseDownTimeout: any;
  private mouseDownInterval: any;

  public render() {
    const { statDef } = this.props;
    const isImportant = _.includes(importantAttributes[this.props.selectedClass], statDef.name);
    const disabled = this.props.remainingPoints === 0;

    return (
      <div key={statDef.name} className={`attribute-row ${isImportant ? 'important' : ''}`}>
        <span>{statDef.name}</span>
        <AllocatePointButton
          direction='right'
          onMouseDown={this.increaseAttribute}
          onMouseUp={this.clearMouseDownInterval}>
        </AllocatePointButton>
        <span className={`attribute-points right ${isImportant ? 'important' : ''} ${disabled ? 'maxmin-points' : ''}`}>
          {this.props.value}
        </span>
        <AllocatePointButton
          direction='left'
          onMouseDown={this.decreaseAttribute}
          onMouseUp={this.clearMouseDownInterval}>
        </AllocatePointButton>
      </div>
    );
  }

  private increaseAttribute = () => {
    this.props.onAllocatePoint(this.props.statDef.name, 1);

    this.mouseDownTimeout = setTimeout(() => {
      this.mouseDownInterval = setInterval(() => {
        this.props.onAllocatePoint(this.props.statDef.name, 1);
      }, 30);
    }, 500);
  }

  private decreaseAttribute = () => {
    this.props.onAllocatePoint(this.props.statDef.name, -1);

    this.mouseDownTimeout = setTimeout(() => {
      this.mouseDownInterval = setInterval(() => {
        this.props.onAllocatePoint(this.props.statDef.name, -1);
      }, 30);
    }, 500);
  }

  private clearMouseDownInterval = () => {
    clearTimeout(this.mouseDownTimeout);
    clearInterval(this.mouseDownInterval);
    this.mouseDownInterval = null;
  }
}

class StatRowWithInjectedContext extends React.Component<ComponentProps> {
  public render() {
    return (
      <StatsSelectContext.Consumer>
        {({ remainingPoints, onAllocatePoint }) => (
          <StatRow {...this.props} remainingPoints={remainingPoints} onAllocatePoint={onAllocatePoint} />
        )}
      </StatsSelectContext.Consumer>
    );
  }
}

export default StatRowWithInjectedContext;

