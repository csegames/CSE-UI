/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import { styled } from '@csegames/linaria/react';

import { AbilityButtonInfo } from '../../AbilityBar/AbilityButton/AbilityButtonView';
import AbilityQueueItem from './AbilityQueueItem';

const Container = styled.div`
  display: flex;
  margin-right: ${(props: any) => props.marginRight}px;
  opacity: 0.9;
`;

export interface QueuedAbilities {
  [track: string]: AbilityButtonInfo[];
}

export interface AbilityQueueListProps {
  queuedAbilities: QueuedAbilities;
}

class AbilityQueueList extends React.Component<AbilityQueueListProps> {
  public render() {
    return (
      <Container marginRight={50}>
        {_.values(this.props.queuedAbilities).map((abilityTrack, i) => {
          return (
            <Container key={i} marginRight={5}>
              {abilityTrack.map((ability, i) => <AbilityQueueItem key={ability.id} ability={ability} />)}
            </Container>
          );
        })}
      </Container>
    );
  }
}

export default AbilityQueueList;
