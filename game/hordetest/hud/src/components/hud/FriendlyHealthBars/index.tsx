/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { FriendlyHealthBar } from './FriendlyHealthBar';

type EntityID = string;

export interface Props {
}

export interface State {
  friendlyPlayers: { [name: string]: EntityID };
}

const HEALTH_BAR_LIMIT = 5;

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
    return sortedPlayers.slice(0, 5).map((playerName) => {
      return <FriendlyHealthBar playerName={playerName} />;
    });
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
      this.setState({ friendlyPlayers: {} });
    }
  }

  private handleEntityStateRemoved = (entityID: string) => {
    const friendlyPlayers = cloneDeep(this.state.friendlyPlayers);
    const nameOfPlayer = Object.keys(friendlyPlayers).find(name => friendlyPlayers[name] === entityID);

    if (nameOfPlayer) {
      delete friendlyPlayers[nameOfPlayer];
      this.setState({ friendlyPlayers });
    }
  }

  private updateFriendlyPlayerNames = () => {
    const currentFriendlyHealthBarsAmount = Object.keys(this.state.friendlyPlayers).length;
    if (currentFriendlyHealthBarsAmount === HEALTH_BAR_LIMIT) return;

    const playerEntities = Object.values(cloneDeep(hordetest.game.entities)).filter(e => {
      return e.type === 'player' && e.name !== hordetest.game.selfPlayerState.name;
    });

    const notAddedEntities: { name: string, entityID: string }[] = [];
    let friendlyPlayers = cloneDeep(this.state.friendlyPlayers);
    playerEntities.forEach((entity) => {
      if (friendlyPlayers[entity.name]) return;

      notAddedEntities.push({ name: entity.name, entityID: entity.entityID });
    });

    if (currentFriendlyHealthBarsAmount < HEALTH_BAR_LIMIT && notAddedEntities.length > 0) {
      const friendsNeeded = HEALTH_BAR_LIMIT - currentFriendlyHealthBarsAmount;
      notAddedEntities.slice(0, friendsNeeded);
      notAddedEntities.forEach((entity) => {
        friendlyPlayers[entity.name] = entity.entityID;
      });
      this.setState({ friendlyPlayers });
    }
  }
}
