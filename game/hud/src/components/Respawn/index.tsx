/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import RespawnLocation from './RespawnLocation';

export interface RespawnProps {
  setVisibility: (vis: boolean) => void;
}
export interface RespawnState {
  nearest: RespawnLocation[];
}

class Respawn extends React.Component<RespawnProps, RespawnState> {
  private eventHandles: EventHandle[] = [];
  public name: string = 'Respawn';
  public home: RespawnLocation = new RespawnLocation(-1, 0, 0);
  public faction: string = null;

  constructor(props: RespawnProps) {
    super(props);
    this.state = {
      nearest: null,
    };
  }

  public render() {
    const buttons: JSX.Element[] = [];
    if (this.state.nearest) {
      this.state.nearest.forEach((spawn: RespawnLocation): void => {
        buttons.push(this.renderButton(spawn, 'Control Point'));
      });
    }
    return (
      <div className='frame cu-window cu-window-transparent cu-window-auto-size'>
        <div className='cu-window-header'><div className='title'>Respawn</div></div>
        <div className='cu-window-content'>
          {this.renderButton(this.home, 'Default')}
          {buttons}
        </div>
      </div>
    );
  }

  public componentDidMount() {
    this.eventHandles.push(game.selfPlayerState.onUpdated(() => {
      switch (game.selfPlayerState.faction) {
        case Faction.Arthurian: this.faction = 'A'; break;
        case Faction.TDD: this.faction = 'T'; break;
        case Faction.Viking: this.faction = 'V'; break;
      }
    }));
  }

  public componentWillUnmount() {
    this.eventHandles.forEach(eventHandle => eventHandle.clear());
  }

  private renderButton = (location: RespawnLocation, label: string) => {
    let distance: JSX.Element;
    if (location.distance !== undefined) {
      distance =
        <div className='distance'>
          ({Math.round(location.distance)}m)
        </div>;
    }
    return (
      <div className='respawn__button' onClick={() => game.selfPlayerState.respawn(location.id + '')}>
        <div className='label'>
          {distance}
          {label}
        </div>
      </div>
    );
  }
}

export default Respawn;
