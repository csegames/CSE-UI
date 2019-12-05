/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { throttle, isEqual } from 'lodash';

import { HealthBar } from './HealthBar';
import { ActionButtons } from './ActionButtons';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const HealthBarContainer = styled.div`
  margin-left: 15px;
  margin-bottom: 5px;
`;

const ExtrasContainer = styled.div`
  display: flex;
`;

const ActionButtonsContainer = styled.div`
  margin-left: 5px;
`;

const GeneralInfoContainer = styled.div`
  display: flex;
  align-items: center;
  width: 150px;
  height: 75px;
  background-color: rgba(0, 0, 0, 0.7);
  transform: skewX(-10deg);
`;

const HeartsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
`;

const Heart = styled.div`
  font-size: 18px;
  color: #ff0000;
`;

const RunesContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 5px;
`;

const RuneItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;
`;

const RuneIcon = styled.div`
  &.Protection {
    color: #00ffff;
  }

  &.Health {
    color: #39b54a;
  }

  &.Weapon {
    color: #f36c00;
  }
`;

const RuneBoldNumber = styled.div`
  font-family: Exo;
  font-weight: bold;
  color: white;
  margin-left: 2px;
`;

const RuneBonus = styled.div`
  font-family: Exo;
  font-size: 0.8em;
  color: white;
  margin-left: 5px;
`;

interface Runes {
  [runeType: number]: number;
}

export interface Props {
}

export interface State {
  isAlive: boolean;
  health: CurrentMax;
  resource: CurrentMax;
  divineBarrier: CurrentMax;
  statuses: ArrayMap<{ id: number } & Timing>;

  // Use RuneType enum as key
  collectedRunes: Runes;
  runeBonuses: Runes;
}
// throttle 200
export class SelfHealthBar extends React.Component<Props, State> {
  private evh: EventHandle[] = [];
  constructor(props: Props) {
    super(props);
    this.state = {
      isAlive: cloneDeep(hordetest.game.selfPlayerState.isAlive),
      health: {
        current: hordetest.game.selfPlayerState.health[0].current,
        max: hordetest.game.selfPlayerState.health[0].max,
      },
      resource: { ...(cloneDeep(hordetest.game.selfPlayerState.stamina)) },
      divineBarrier: { ...(cloneDeep(hordetest.game.selfPlayerState.blood)) },
      statuses: {},
      collectedRunes: {
        [RuneType.Weapon]: 0,
        [RuneType.Protection]: 0,
        [RuneType.Health]: 0,
      },
      runeBonuses: {
        [RuneType.Weapon]: 0,
        [RuneType.Protection]: 0,
        [RuneType.Health]: 0,
      },
    };

    this.handlePlayerStateUpdate = throttle(this.handlePlayerStateUpdate, 200);
  }

  public render() {
    const { isAlive, health, resource, divineBarrier, collectedRunes, runeBonuses } = this.state;
    const playerState = hordetest.game.selfPlayerState;
    const hearts = Array.from(Array(playerState.maxDeaths - playerState.currentDeaths));
    return (
      <Container>
        <HealthBarContainer>
          <HealthBar
            isAlive={isAlive}
            resourcesWidth={320}
            divineBarrier={divineBarrier}
            health={health}
            championResource={resource}
            collectedRunes={collectedRunes}
            runeBonuses={runeBonuses}
            race={hordetest.game.selfPlayerState.race}
          />
        </HealthBarContainer>
        <ExtrasContainer>
          <GeneralInfoContainer>
            <HeartsContainer>
              {hearts.map((_, i) => {
                return (
                  <Heart className='fs-icon-misc-heart' />
                );
              })}
            </HeartsContainer>

            <RunesContainer>
              <RuneItem>
                <RuneIcon className={'fs-icon-rune-barrier Protection'} />
                <RuneBoldNumber>{collectedRunes[RuneType.Protection]}</RuneBoldNumber>
                <RuneBonus>({runeBonuses[RuneType.Protection]}%)</RuneBonus>
              </RuneItem>
              <RuneItem>
                <RuneIcon className={'fs-icon-rune-health Health'} />
                <RuneBoldNumber>{collectedRunes[RuneType.Health]}</RuneBoldNumber>
                <RuneBonus>({runeBonuses[RuneType.Health]}%)</RuneBonus>
              </RuneItem>
              <RuneItem>
                <RuneIcon className={'fs-icon-rune-damage Weapon'} />
                <RuneBoldNumber>{collectedRunes[RuneType.Weapon]}</RuneBoldNumber>
                <RuneBonus>({runeBonuses[RuneType.Weapon]}%)</RuneBonus>
              </RuneItem>
            </RunesContainer>
          </GeneralInfoContainer>
          <ActionButtonsContainer>
            <ActionButtons />
          </ActionButtonsContainer>
        </ExtrasContainer>
      </Container>
    );
  }

  public componentDidMount() {
    this.evh.push(hordetest.game.selfPlayerState.onUpdated(this.handlePlayerStateUpdate));
    this.evh.push(hordetest.game.onCollectedRunesUpdate(this.handleCollectedRunesUpdate));
  }

  public componentWillUnmount() {
    this.evh.forEach(e => e.clear());
  }

  private handlePlayerStateUpdate = () => {
    const { health, resource, divineBarrier, isAlive } = this.state;
    let stateUpdate: Partial<State> = {};
    if (!hordetest.game.selfPlayerState.health[0].current.floatEquals(health.current) ||
        !hordetest.game.selfPlayerState.health[0].max.floatEquals(health.max)) {
      stateUpdate = {
        ...stateUpdate,
        health: cloneDeep(hordetest.game.selfPlayerState.health[0]),
      };
    }

    if (!hordetest.game.selfPlayerState.stamina.current.floatEquals(resource.current) ||
        !hordetest.game.selfPlayerState.stamina.max.floatEquals(resource.max)) {
      stateUpdate = {
        ...stateUpdate,
        resource: cloneDeep(hordetest.game.selfPlayerState.stamina),
      };
    }

    if (!hordetest.game.selfPlayerState.blood.current.floatEquals(divineBarrier.current) ||
        !hordetest.game.selfPlayerState.blood.max.floatEquals(divineBarrier.max)) {
      stateUpdate = {
        ...stateUpdate,
        divineBarrier: cloneDeep(hordetest.game.selfPlayerState.blood),
      };
    }

    if (hordetest.game.selfPlayerState.isAlive !== isAlive) {
      stateUpdate = {
        ...stateUpdate,
        isAlive: cloneDeep(hordetest.game.selfPlayerState.isAlive),
      };
    }

    if (!isEqual(hordetest.game.selfPlayerState.statuses, this.state.statuses)) {
      stateUpdate = {
        ...stateUpdate,
        statuses: cloneDeep(hordetest.game.selfPlayerState.statuses),
      }
    }

    if (Object.keys(stateUpdate).length > 0) {
      this.setState(stateUpdate as State);
    }
  }

  private handleCollectedRunesUpdate = (runes: Runes, runeBonuses: Runes) => {
    if (!runes) return;

    this.setState({ collectedRunes: runes, runeBonuses });
  }
}
