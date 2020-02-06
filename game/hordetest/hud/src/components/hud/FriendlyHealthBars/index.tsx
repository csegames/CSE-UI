/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { FriendlyHealthBar } from './FriendlyHealthBar';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 650px;
`;

type EntityID = string;

export interface Props {
}

export interface State {
  friendlyPlayers: { [name: string]: EntityID };
}

const HEALTH_BAR_LIMIT = 9;

export class FriendlyHealthBars extends React.Component<Props, State> {
  private evh: EventHandle[] = [];
  constructor(props: Props) {
    super(props);
    this.state = {
      friendlyPlayers: {},
    };
  }

  public render() {
    const sortedPlayers = Object.keys(this.state.friendlyPlayers).sort((a, b) => a.localeCompare(b));
    return (
      <Container>
        {sortedPlayers.slice(0, 9).map((playerName) => {
          return <FriendlyHealthBar playerName={playerName} />;
        })};
      </Container>
    );
  }

  public componentDidMount() {
    this.evh.push(hordetest.game.onEntityStateUpdate(this.updateFriendlyPlayerNames));
    this.evh.push(hordetest.game.onEntityStateRemoved(this.handleEntityStateRemoved));
    this.evh.push(hordetest.game.onScenarioRoundEnded(this.handleScenarioRoundEnded));
  }

  public componentWillUnmount() {
    this.evh.forEach((e) => {
      e.clear();
    });
  }

  private handleScenarioRoundEnded = (scenarioID: string, roundID: string, didEnd: boolean) => {
    if (didEnd) {
      console.log(`Resetting known friendly players to 0`);
      this.setState({ friendlyPlayers: {} });
    }
  }

  private handleEntityStateRemoved = (entityID: string) => {
    const friendlyPlayers = cloneDeep(this.state.friendlyPlayers);
    const nameOfPlayer = Object.keys(friendlyPlayers).find(name => friendlyPlayers[name] === entityID);

    if (nameOfPlayer) {
      console.log(`Removing ${entityID} (${nameOfPlayer}) from known healthbars`);
      delete friendlyPlayers[nameOfPlayer];
      this.setState({ friendlyPlayers });
    }
  }

  private updateFriendlyPlayerNames = (entityState: EntityStateModel) => {
    if (entityState["type"] !== "player" || entityState["characterKind"] !== CharacterKind.User ) {
      return;
    }

    const currentFriendlyHealthBarsAmount = Object.keys(this.state.friendlyPlayers).length;
    if (currentFriendlyHealthBarsAmount === HEALTH_BAR_LIMIT) {
      console.log(`Cannot add ${entityState.name} to healthbars. Full`);
      return;
    }

    const playerEntities = Object.values(cloneDeep(hordetest.game.entities)).filter(e => {
      return e.type === 'player' && e.name !== hordetest.game.selfPlayerState.name && e.characterKind === CharacterKind.User;
    });

    const notAddedEntities: { name: string, entityID: string }[] = [];
    let friendlyPlayers = cloneDeep(this.state.friendlyPlayers);
    playerEntities.forEach((entity) => {
      if (friendlyPlayers[entity.name]) {
        return;
      }
      console.log(`Queueing ${entity.name} to be added to health bar`);
      notAddedEntities.push({ name: entity.name, entityID: entity.entityID });
    });

    if (currentFriendlyHealthBarsAmount < HEALTH_BAR_LIMIT && notAddedEntities.length > 0) {
      const friendsNeeded = HEALTH_BAR_LIMIT - currentFriendlyHealthBarsAmount;
      console.log(`Attempting to add ${notAddedEntities.length} healthbars with ${friendsNeeded} slots (${currentFriendlyHealthBarsAmount}/${HEALTH_BAR_LIMIT}).`);
      notAddedEntities.slice(0, friendsNeeded);
      notAddedEntities.forEach((entity) => {
        console.log(`Adding '${entity.name}' to healthbar`);
        friendlyPlayers[entity.name] = entity.entityID;
      });
      this.setState({ friendlyPlayers });
    }
  }
}
