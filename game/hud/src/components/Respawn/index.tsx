/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {client, events, Faction, legacyAPI, hasClientAPI} from 'camelot-unchained';
import * as React from 'react';
import RespawnLocation from './RespawnLocation';

export interface RespawnProps {
  setVisibility: (vis: boolean) => void;
};
export interface RespawnState {
  nearest: RespawnLocation[];
};

class Respawn extends React.Component<RespawnProps, RespawnState> {
  public name: string = 'Respawn';
  home: RespawnLocation = new RespawnLocation(-1, 0, 0);
  faction: string = null;

  constructor(props: RespawnProps) {
    super(props);
    this.state = {
      nearest: null
    };
  }

  componentDidMount() {

    if (!hasClientAPI()) return;

    client.OnCharacterFactionChanged((cf: number) => {
      switch(cf) {
        case Faction.Arthurian: this.faction = 'A'; break;
        case Faction.TDD: this.faction = 'T'; break;
        case Faction.Viking: this.faction = 'V'; break;
      }
    });

    this.getSpawnPoints((spawns: RespawnLocation[]): void => {
      this.setState({ nearest: spawns.slice(0,3)});
    });
  }

  // specification
  // spawn points are 'home' spawns
  // control points are spawnable if owned
  // show home point + 3 nearest controlled control points

  getSpawnPoints = (loaded: (spawns: RespawnLocation[]) => void): void => {
    if (!hasClientAPI()) return;
    console.log('getting spawn points')
    const spawns: RespawnLocation[] = [];


    // load control points
    legacyAPI.getControlGame(true).then((data:any) => {
      if (!hasClientAPI()) return;
      
      // data.controlPoints is an array of spawns, each member has
      // x, y, id and faction (which is a letter)
      const controlPoints: any[] = data.controlPoints;
      const x: number = client.locationX;
      const y: number = client.locationY;
      if (controlPoints) {
        controlPoints.forEach((cp: any) => {
          if (cp.faction === this.faction) {
            spawns.push(new RespawnLocation(cp.id, cp.x, cp.y));
          }
        });
        spawns.forEach((spawn: RespawnLocation): void => {
          spawn.calcDistanceFromXY(x,y);
        });
        spawns.sort((a: RespawnLocation, b: RespawnLocation): number => {
          return a.distance - b.distance;
        });
      }
      loaded(spawns);
    }, () => {
      loaded(spawns);
    });
  }

  renderButton = (location: RespawnLocation, label: string) => {
    let distance: JSX.Element;
    if (location.distance !== undefined) {
      distance =
        <div className='distance'>
          ({Math.round(location.distance)}m)
        </div>;
    }
    return (
      <div className='respawn__button' onClick={() => client.Respawn(location.id + '')}>
        <div className='label'>
          {distance}
          {label}
        </div>
      </div>
    );
  }

  render() {
    if (!hasClientAPI()) return null;
        
    const buttons: JSX.Element[] = [];
    let key: number = 0;
    if (this.state.nearest) {
      this.state.nearest.forEach((spawn: RespawnLocation): void => {
        buttons.push(this.renderButton(spawn, 'Control Point'));
      });
    }
    return (
      <div className='frame cu-window cu-window-transparent cu-window-auto-size'>
        <div className="cu-window-header"><div className="title">Respawn</div></div>
        <div className="cu-window-content">
          {this.renderButton(this.home, 'Default')}
          {buttons}
        </div>
      </div>
    );
  }
}

export default Respawn;
