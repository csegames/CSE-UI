/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import React from 'react';
import { throttle } from 'lodash';
import { styled } from '@csegames/linaria/react';
import { getViewportSize } from 'hudlib/viewport';
import { Tooltip } from 'shared/Tooltip';

const Container = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  flex-direction: column;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;

  &.isRespawning {
    animation: pulse 0.5s infinite alternate;
  }

  @keyframes pulse {
    from {
      opacity: 1;
    }

    to {
      opacity: 0.6;
    }
  }
`;

const ObjectiveContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 35px;
  width: 35px;
  font-size: 24px;
  font-weight: bold;
  color: white;
  background-color: blue;
  box-shadow: 0 0 10px 3px rgba(0, 0, 0, 0.8), inset 0px 0px 10px 3px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 50px;

  &.lordkeep {
    background: radial-gradient(#862e3e, #231d1d);
    border: 1px solid #862e3e;
    outline: 2px solid rgba(0, 0, 0, 0.4);
    outline-offset: -4px;
    color: #d24d64;
    height: 40px;
    width: 30px;
    border-radius: 0px;
  }

  &.Arthurian {
    background: radial-gradient(#fae899, #e8cf72);
    border: 1px solid #fae899;
    outline-offset: -4px;
    color: #5f3a27;
  }

  &.Viking {
    background: radial-gradient(#bbe9f0, #77c8cb);
    border: 1px solid #bbe9f0;
    outline-offset: -4px;
    color: #192e49;
  }

  &.TDD {
    background: radial-gradient(#c6f0a3, #8fc25b);
    border: 1px solid #c6f0a3;
    outline: 2px solid rgba(0, 0, 0, 0.4);
    outline-offset: -4px;
    color: #481f0b;
  }
`;

const BarContainer = styled.div`
  bottom: -1px;
  height: 6px;
  width: 30px;
  background-color: rgba(0, 0, 0, 0.8);
  padding: 2px;
`;

const Bar = styled.div`
  height: 100%;
  background: linear-gradient(to right, #c12032, #ed6e45);
  box-shadow: inset 0px 0px 2px 1px rgba(255, 240, 0, 0.5);
`;

const AttackingFactionContainer = styled.div`
  display: flex;
`;

const AttackingFaction = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 15px;
  width: 15px;
  font-size: 14px;
  font-weight: bold;
  font-family: Lato;

  &.Arthurian {
    background-color: #e4cf7e;
    outline: 1px solid #5f3a27;
    outline-offset: -2px;
    color: #5f3a27;
  }

  &.Viking {
    background-color: #77c8cb;
    outline: 1px solid #192e49;
    outline-offset: -2px;
    color: #192e49;
  }

  &.TDD {
    background-color: #8fc25b;
    outline: 1px solid #481f0b;
    outline-offset: -2px;
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
  entityId: string;
  plotName: string;
  faction: Faction;
  attackingFactions: AttackingFactions;
  mapSettings: BuildingPlotMapUISettings;
  position: Vec3f;

  // Only for keep lords
  keepLordEntityId: string;
  keepLordName: string;
  isUnderAttack: boolean;
  isRespawning: boolean;
  keepLordHealth: CurrentMax;
}

export class Objective extends React.Component<Props, State> {
  private plotEntityUpdateEvh: EventHandle;
  private keepLordEntityEvh: EventHandle;
  private isUnderAttackTimeout: number;
  constructor(props: Props) {
    super(props);

    const plotEntityState = cloneDeep((camelotunchained.game.entities[props.entityId] as any) as BuildingPlotStateModel);
    const keepLordEntityState = plotEntityState ?
      cloneDeep(camelotunchained.game.entities[plotEntityState.keepLordEntityID] as PlayerStateModel) : null;
    this.handlePlotEntityUpdate = throttle(this.handlePlotEntityUpdate, 500);
    this.state = {
      entityId: plotEntityState.entityID,
      plotName: plotEntityState.name,
      faction: plotEntityState.faction,
      attackingFactions: plotEntityState.attackingFactions,
      mapSettings: plotEntityState.mapSettings,
      position: plotEntityState.position,

      keepLordEntityId: keepLordEntityState && keepLordEntityState.entityID,
      keepLordName: keepLordEntityState && keepLordEntityState.name,
      isUnderAttack: false,
      isRespawning: false,
      keepLordHealth: keepLordEntityState && keepLordEntityState.health && keepLordEntityState.health[0] ?
        keepLordEntityState.health[0] : { current: 0, max: 100 },
    };
  }

  public render() {
    const isLordKeep = this.isKeepLord();
    const lordKeepClass = isLordKeep ? 'lordkeep' : '';
    return (
      <Tooltip content={isLordKeep ? this.state.keepLordName : this.state.plotName}>
        <Container style={this.getPosition()}>
          <ObjectiveContainer className={`${lordKeepClass} ${Faction[this.state.faction]}`}>
            {isLordKeep && this.state.faction === Faction.Factionless ?
              <span className='icon-enemy'></span> : Faction[this.state.faction][0]}
            {isLordKeep && this.state.isUnderAttack &&
              <UnderAttack className='icon-category-weapons' />
            }
          </ObjectiveContainer>
          {isLordKeep &&
            <BarContainer>
              <Bar style={{ width: `${(this.state.keepLordHealth.current / this.state.keepLordHealth.max) * 100}%` }} />
            </BarContainer>
          }
          <AttackingFactionContainer>
            {BitFlag.hasBits(this.state.attackingFactions, AttackingFactions.Arthurian) ?
              <AttackingFaction className='Arthurian'>A</AttackingFaction> : null
            }
            {BitFlag.hasBits(this.state.attackingFactions, AttackingFactions.TDD) ?
              <AttackingFaction className='TDD'>T</AttackingFaction> : null
            }
            {BitFlag.hasBits(this.state.attackingFactions, AttackingFactions.Viking) ?
              <AttackingFaction className='Viking'>V</AttackingFaction> : null
            }
          </AttackingFactionContainer>
        </Container>
      </Tooltip>
    );
  }

  public componentDidMount() {
    this.plotEntityUpdateEvh = game.on('plotUpdate', this.handlePlotEntityUpdate);

    if (this.state.keepLordEntityId &&
        camelotunchained.game.entities[this.state.keepLordEntityId] &&
        camelotunchained.game.entities[this.state.keepLordEntityId].onUpdated) {
      this.keepLordEntityEvh =
        camelotunchained.game.entities[this.state.keepLordEntityId].onUpdated(this.handleKeepLordUpdate);
    }
  }

  public componentWillUnmount() {
    if (this.plotEntityUpdateEvh) {
      this.plotEntityUpdateEvh.clear();
    }

    if (this.keepLordEntityEvh) {
      this.keepLordEntityEvh.clear();
    }
  }

  private initializeKeepLordEvh = (keepLordEntityId: string) => {
    if (this.keepLordEntityEvh) {
      this.keepLordEntityEvh.clear();
      this.keepLordEntityEvh = null;
    }

    if (!camelotunchained.game.entities[keepLordEntityId] || !camelotunchained.game.entities[keepLordEntityId].onUpdated) {
      console.error('No update function attached for keep lord entity');
      console.log(camelotunchained.game.entities[keepLordEntityId]);
      return;
    }

    this.keepLordEntityEvh = camelotunchained.game.entities[keepLordEntityId].onUpdated(this.handleKeepLordUpdate);
  }

  private isKeepLord = () => {
    return this.state.mapSettings === BuildingPlotMapUISettings.KeepLordPlot;
  }

  private handlePlotEntityUpdate = (updatedPlot: BuildingPlotStateModel) => {
    if (updatedPlot.entityID !== this.state.entityId) {
      return;
    }

    if (updatedPlot.keepLordEntityID !== this.state.keepLordEntityId) {
      // Keep lord entity id changed so initialize event updates for new entity
      this.initializeKeepLordEvh(updatedPlot.keepLordEntityID);
    }

    this.setState({
      faction: updatedPlot.faction,
      attackingFactions: updatedPlot.attackingFactions,
      mapSettings: updatedPlot.mapSettings,
      position: updatedPlot.position,
      keepLordEntityId: updatedPlot.keepLordEntityID,
      plotName: updatedPlot.name,
    });
  }

  private handleKeepLordUpdate = () => {
    const keepLordEntityState = camelotunchained.game.entities[this.state.keepLordEntityId] as PlayerStateModel;
    if (!keepLordEntityState) {
      console.error('Got a keep lord entity state update that did not exist');
      return;
    }

    const entityHealth = keepLordEntityState.health && keepLordEntityState.health[0];

    if (entityHealth && entityHealth.current < this.state.keepLordHealth.current) {
      this.showIsUnderAttack();
    }

    this.setState({
      keepLordEntityId: keepLordEntityState.entityID,
      isRespawning: entityHealth && entityHealth.current === 0,
      keepLordHealth: entityHealth || { current: 0, max: 100 },
      keepLordName: keepLordEntityState.name,
    });
  }

  private getPosition = () => {
    const scale = game.map.scale || 0.1;
    const viewportSize = getViewportSize();
    const heightScale = viewportSize.height / 1217;
    const widthScale = viewportSize.width / 1367;
    return {
      marginTop: (-1 * this.state.position.y * scale + game.map.positionOffset.y) * heightScale,
      marginLeft: (this.state.position.x * scale + game.map.positionOffset.x) * widthScale,
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
