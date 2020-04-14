/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

const Container = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const ObjectiveContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 30px;
  font-size: 24px;
  font-weight: bold;
  color: white;
  background-color: blue;

  &.lordkeep {
    background-color: #766458;
  }

  &.Arthurian {
    background-color: #e8cf72;
    border: 1px solid #5f3a27;
    color: #5f3a27;
  }

  &.Viking {
    background-color: #77c8cb;
    border-color: #192e49;
    color: #192e49;
  }

  &.TDD {
    background-color: #8fc25b;
    border-color: #481f0b;
    color: #481f0b;
  }
`;

const BarContainer = styled.div`
  position: relative;
  height: 8px;
  width: 30px;
  background-color: rgba(0, 0, 0, 0.8);
`;

const Bar = styled.div`
  height: 100%;
  background: linear-gradient(to right, #c12032, #ed6e45);
`;

const AttackingFactionContainer = styled.div`
  display: flex;
`;

const AttackingFaction = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 15px;
  flex: 1;
  font-size: 14px;
  font-weight: bold;

  &.Arthurian {
    background-color: #e8cf72;
    color: #5f3a27;
  }

  &.Viking {
    background-color: #77c8cb;
    color: #192e49;
  }

  &.TDD {
    background-color: #8fc25b;
    color: #481f0b;
  }
`;

const UnderAttack = styled.div`
  position: absolute;
  font-size: 60px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: pulse 0.5s infinite alternate;

  @keyframes pulse {
    from {
      opacity: 1;
    }

    to {
      opacity: 0.6;
    }
  }
`;

export interface Props {
  entityId: string;
}

export interface State {
  entityState: BuildingPlotStateModel;

  // Only for keep lords
  isUnderAttack: boolean;
}

export class Objective extends React.Component<Props, State> {
  private entityUpdateEvh: EventHandle;
  private isUnderAttackTimeout: number;
  constructor(props: Props) {
    super(props);
    this.state = {
      entityState: cloneDeep(camelotunchained.game.entities[this.props.entityId]) as any,
      isUnderAttack: false,
    };
  }

  public render() {
    const { entityState } = this.state;
    const isLordKeep = this.isKeepLord();
    const lordKeepClass = isLordKeep ? 'lordkeep' : '';
    const captureProgress = entityState.captureProgress ? entityState.captureProgress : 0;
    return (
      <Container style={this.getPosition()}>
        <ObjectiveContainer className={`${lordKeepClass} ${Faction[entityState.faction]}`}>
          {isLordKeep ? <span className='icon-category-building'></span> : Faction[entityState.faction][0]}
          {isLordKeep && this.state.isUnderAttack &&
            <UnderAttack className='icon-category-weapons' />
          }
        </ObjectiveContainer>
        {isLordKeep &&
          <BarContainer>
            <Bar style={{ width: `${100 - (captureProgress * 100)}%` }} />
          </BarContainer>
        }
        <AttackingFactionContainer>
          {(entityState.attackingFactions & Faction.Arthurian) ?
            <AttackingFaction className='Arthurian'>A</AttackingFaction> : null
          }
          {(entityState.attackingFactions & Faction.TDD) ?
            <AttackingFaction className='TDD'>T</AttackingFaction> : null
          }
          {(entityState.attackingFactions & Faction.Viking) ?
            <AttackingFaction className='Viking'>V</AttackingFaction> : null
          }
        </AttackingFactionContainer>
      </Container>
    );
  }
  
  public componentDidMount() {
    if (!this.props.entityId ||
        !camelotunchained.game.entities[this.props.entityId] ||
        !camelotunchained.game.entities[this.props.entityId].onUpdated) {
      return;
    }

    this.entityUpdateEvh = camelotunchained.game.entities[this.props.entityId].onUpdated(this.handleEntityUpdate);
  }

  public componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.isKeepLord() && prevState.entityState.captureProgress > this.state.entityState.captureProgress) {
      this.showIsUnderAttack();
    }
  }

  public componentWillUnmount() {
    if (this.entityUpdateEvh) {
      this.entityUpdateEvh.clear();
    }
  }

  private isKeepLord = () => {
    return this.state.entityState.mapSettings === BuildingPlotMapUISettings.KeepLordPlot;
  }

  private handleEntityUpdate = () => {
    this.setState({ entityState: cloneDeep(camelotunchained.game.entities[this.props.entityId]) as any });
  }

  private getPosition = () => {
    const scale = game.map.scale || 0.1;
    return {
      marginTop: -1 * this.state.entityState.position.y * scale + game.map.positionOffset.y,
      marginLeft: this.state.entityState.position.x * scale + game.map.positionOffset.x,
    }
  }

  private showIsUnderAttack = () => {
    if (this.isUnderAttackTimeout) {
      window.clearTimeout(this.isUnderAttackTimeout);
    }

    if (!this.state.isUnderAttack) {
      this.setState({ isUnderAttack: true });
    }

    this.isUnderAttackTimeout = window.setTimeout(() => {
      this.setState({ isUnderAttack: false });
    }, 2000);
  }
}
