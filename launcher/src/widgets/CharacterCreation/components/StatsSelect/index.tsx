/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';

import { StatsSelectContext, StatIdToValue, StatObjectInfo } from './StatsSelectContext';
import StatRow from './StatRow';
import StatsView from './StatsView';
import { shard } from '../../../../api/graphql';
import { ArchetypeInfo } from '../../../../api/webapi';

type StatDefinitionGQL = shard.StatDefinitionGQL;

export interface ComponentProps {
  selectedClass: ArchetypeInfo;
}

export interface Props extends ComponentProps {
  remainingPoints: number;
  distributableStats: StatDefinitionGQL[];
  statIdToValue: StatIdToValue;
  primaryStats: StatObjectInfo[];
  secondaryStats: StatObjectInfo[];
  derivedStats: StatObjectInfo[];
}

const AllocateInstructions = styled.div`
  font-size: 12px;
  color: #605345;
  font-weight: 600;
  cursor: default;
`;

class StatsSelect extends React.Component<Props> {
  public render() {
    return (
      <div className='page'>
        <video src={`videos/paper-bg.webm`} poster={`videos/paper-bg.jpg`} autoPlay loop></video>
        <div className='selection-box'>
          <h6>
            Distribute attribute points <span className='points'>(Remaining {this.props.remainingPoints})</span>
          </h6>
          {this.props.distributableStats.map((statDef: StatDefinitionGQL) => (
            <StatRow
              key={statDef.id}
              statDef={statDef}
              value={this.props.statIdToValue[statDef.id] || 0}
              selectedClass={this.props.selectedClass}
            />
          ))}
          <AllocateInstructions>*Hold down buttons to allocate points faster</AllocateInstructions>
        </div>
        <div className='view-content row attributes-view'>
          <div style={{ width: '100%' }} className='col s12'>
            <StatsView title='Primary' statArray={this.props.primaryStats} />
            <StatsView title='Secondary' statArray={this.props.secondaryStats} />
            <StatsView title='Derived' statArray={this.props.derivedStats} />
          </div>
        </div>
      </div>
    );
  }
}

class StatsSelectWithInjectedContext extends React.Component<ComponentProps> {
  public render() {
    return (
      <StatsSelectContext.Consumer>
        {({ remainingPoints, distributableStats, statIdToValue, primaryStats, secondaryStats, derivedStats }) => (
          <StatsSelect
            {...this.props}
            remainingPoints={remainingPoints}
            distributableStats={distributableStats}
            statIdToValue={statIdToValue}
            primaryStats={primaryStats}
            secondaryStats={secondaryStats}
            derivedStats={derivedStats}
          />
        )}
      </StatsSelectContext.Consumer>
    );
  }
}

export default StatsSelectWithInjectedContext;
