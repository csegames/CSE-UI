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
import { shard } from '../../../../api/graphql';
import { ArchetypeInfo } from '../../../../api/webapi';

type StatDefinitionGQL = shard.StatDefinitionGQL;

export interface ComponentProps {
  statDef: StatDefinitionGQL;
  value: number;
  selectedClass: ArchetypeInfo;
}

export interface Props extends ComponentProps {
  remainingPoints: number;
  onAllocatePoint: (statId: string, amount: number) => void;
}

export interface State {}

export class StatRow extends React.Component<Props, State> {
  private mouseDownTimeout: any;
  private mouseDownInterval: any;

  public render() {
    const { statDef, selectedClass } = this.props;
    const isImportant =
      selectedClass != null &&
      selectedClass.importantStats != null &&
      _.includes(selectedClass.importantStats, statDef.id);
    const disabled = this.props.remainingPoints === 0;

    return (
      <div key={statDef.name} className={`attribute-row ${isImportant ? 'important' : ''}`}>
        <span>{statDef.name}</span>
        <AllocatePointButton
          direction='right'
          onMouseDown={this.increaseAttribute}
          onMouseUp={this.clearMouseDownInterval}
        ></AllocatePointButton>
        <span className={`attribute-points right ${isImportant ? 'important' : ''} ${disabled ? 'maxmin-points' : ''}`}>
          {this.props.value}
        </span>
        <AllocatePointButton
          direction='left'
          onMouseDown={this.decreaseAttribute}
          onMouseUp={this.clearMouseDownInterval}
        ></AllocatePointButton>
      </div>
    );
  }

  private increaseAttribute = () => {
    this.props.onAllocatePoint(this.props.statDef.id, 1);

    this.mouseDownTimeout = window.setTimeout(() => {
      this.mouseDownInterval = window.setInterval(() => {
        this.props.onAllocatePoint(this.props.statDef.id, 1);
      }, 30);
    }, 500);
  };

  private decreaseAttribute = () => {
    this.props.onAllocatePoint(this.props.statDef.id, -1);

    this.mouseDownTimeout = window.setTimeout(() => {
      this.mouseDownInterval = window.setInterval(() => {
        this.props.onAllocatePoint(this.props.statDef.id, -1);
      }, 30);
    }, 500);
  };

  private clearMouseDownInterval = () => {
    clearTimeout(this.mouseDownTimeout);
    clearInterval(this.mouseDownInterval);
    this.mouseDownInterval = null;
  };
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
