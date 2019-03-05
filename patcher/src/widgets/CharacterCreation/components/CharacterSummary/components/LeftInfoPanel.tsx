/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { BanesAndBoonsState } from '../../../services/session/banesAndBoons';

import StatsView from '../../StatsSelect/StatsView';
import TraitsInfo from './TraitsInfo';
import { StatsSelectContext, StatObjectInfo } from '../../StatsSelect/StatsSelectContext';

export const colors = {
  filterBackgroundColor: '#372F2D',
};

const Container = styled.div`
  flex: 2;
  overflow-y: auto;
  background: linear-gradient(top left, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.8));
  padding: 10px;
`;

export interface ComponentProps {
  selectedRace: Race;
  selectedGender: Gender;
  selectedClass: Archetype;
  banesAndBoonsState: BanesAndBoonsState;
}

export interface Props extends ComponentProps {
  primaryStats: StatObjectInfo[];
  secondaryStats: StatObjectInfo[];
  derivedStats: StatObjectInfo[];
}

export class LeftInfoPanel extends React.Component<Props> {
  public render() {
    return (
      <Container id='summary-panel'>
        <StatsView title='Primary' statArray={this.props.primaryStats} howManyGrids={2} />
        <StatsView title='Secondary' statArray={this.props.secondaryStats} howManyGrids={2} />
        <StatsView title='Derived' statArray={this.props.derivedStats} howManyGrids={2} />
        <TraitsInfo banesAndBoonsState={this.props.banesAndBoonsState} />
      </Container>
    );
  }
}

class LeftInfoPanelWithInjectedContext extends React.Component<ComponentProps> {
  public render() {
    return (
      <StatsSelectContext.Consumer>
        {({ primaryStats, secondaryStats, derivedStats }) => (
          <LeftInfoPanel
            {...this.props}
            primaryStats={primaryStats}
            secondaryStats={secondaryStats}
            derivedStats={derivedStats}
          />
        )}
      </StatsSelectContext.Consumer>
    );
  }
}

export default LeftInfoPanelWithInjectedContext;

