/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { HealthBar } from '../HealthBar';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 15px;
`;

const PlayerName = styled.div`
  font-size: 12px;
  width: 130px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 1);
  font-family: Exo;
  color: white;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const ChampionProfileStyle = css`
  height: 49px;
  width: 49px;
`;

export interface Props {
  playerName: string;
}

export interface State {
  entityState: AnyEntityState;
}

export class FriendlyHealthBar extends React.Component<Props, State> {
  private evh: EventHandle;
  constructor(props: Props) {
    super(props);
    this.state = {
      entityState: this.getEntityStateByName(),
    };
  }

  public render() {
    const { entityState } = this.state;
    return (
      <Container>
        <HealthBar
          hideMax
          hideChampionResource
          health={entityState.health[0]}
          championResource={entityState.stamina}
          divineBarrier={entityState.blood}
          resourcesWidth={100}
          championProfileStyles={ChampionProfileStyle}
          race={this.state.entityState.race}
        />
        <PlayerName>{this.props.playerName}</PlayerName>
      </Container>
    );
  }

  public componentDidMount() {
    this.evh = hordetest.game.onEntityStateUpdate(this.handleEntityStateUpdate);
  }

  public componentWillUnmount() {
    this.evh.clear();
  }

  private getEntityStateByName = () => {
    const entity = Object.values(hordetest.game.entities).find(entity => entity.name === this.props.playerName);
    return cloneDeep(entity) as AnyEntityState;
  }

  private handleEntityStateUpdate = (state: AnyEntityState) => {
    if (state.name !== this.props.playerName) return;

    this.setState({ entityState: cloneDeep(state) });
  }
}
