/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { throttle } from 'lodash';

import { HealthBar } from './HealthBar';
import { ActionButtons } from './ActionButtons';
import { Consumables } from './Consumables';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const ConsumablesContainer = styled.div`
  margin-left: -23px;
  margin-bottom: 5px;
`;

const Row = styled.div`
  display: flex;
  align-items: flex-end;
`;

const ActionButtonsContainer = styled.div`
  margin-left: 15px;
`;

interface Runes {
  [runeType: number]: number;
}

export interface Props {
}

export interface State {
  health: CurrentMax;
  resource: CurrentMax;
  divineBarrier: CurrentMax;

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
      health: {
        current: hordetest.game.selfPlayerState.health[0].current,
        max: hordetest.game.selfPlayerState.health[0].max,
      },
      resource: { ...(cloneDeep(hordetest.game.selfPlayerState.stamina)) },
      divineBarrier: { ...(cloneDeep(hordetest.game.selfPlayerState.blood)) },
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
    const { health, resource, divineBarrier, collectedRunes, runeBonuses } = this.state;
    return (
      <Container>
        <ConsumablesContainer>
          <Consumables />
        </ConsumablesContainer>
        <Row>
          <HealthBar
            health={health}
            championResource={resource}
            divineBarrier={divineBarrier}
            collectedRunes={collectedRunes}
            runeBonuses={runeBonuses}
          />
          <ActionButtonsContainer>
            <ActionButtons />
          </ActionButtonsContainer>
        </Row>
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
    const { health, resource, divineBarrier } = this.state;
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
