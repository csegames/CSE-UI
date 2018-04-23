/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import { events, Faction, Spinner } from '@csegames/camelot-unchained';
import { FactionInfo } from '../services/session/factions';

export interface FactionSelectProps {
  factions: FactionInfo[];
  selectedFaction: FactionInfo;
  selectFaction: (Faction: FactionInfo) => void;
  onFactionDoubleClick: () => void;
}

export interface FactionSelectState {
  helpEnabled: boolean;
}

class FactionSelect extends React.Component<FactionSelectProps, FactionSelectState> {
  constructor(props: FactionSelectProps) {
    super(props);
    this.state = {
      helpEnabled: false,
    };
  }

  public render() {
    if (!this.props.factions || _.isEmpty(this.props.factions)) {
      return (
        <div className='cu-character-creation__loading-container'>
          <Spinner />
        </div>
      );
    }
    return (
      <div className='cu-character-creation__faction-select'>
        {this.props.factions.map(this.generateFactionContent)}
      </div>
    );
  }

  private selectFaction = (faction: FactionInfo) => {
    this.props.selectFaction(faction);
    events.fire('play-sound', 'realm-select');
  }

  private generateFactionContent = (info: FactionInfo) => {
    if (info.id === Faction.Factionless) return null;  // players can not be factionless!
    return (
      <div
        key={info.id}
        id={`cu-character-creation__faction-select__section-${info.shortName}`}
        className={`cu-character-creation__faction-select__${info.shortName} ${ this.props.selectedFaction !== null ?
          this.props.selectedFaction.id === info.id ? 'active' : '' : ''}`}
        onClick={this.selectFaction.bind(this, info)}
        onDoubleClick={this.props.onFactionDoubleClick}>
        <div
          className={`cu-character-creation__faction-select__${info.shortName}__shield`}
          onClick={this.selectFaction.bind(this, info)}></div>
        <h4>{info.description}</h4>
        <div
          className={`cu-character-creation__faction-select__${info.shortName}__description`}
          onClick={this.selectFaction.bind(this, info)}>
          {/*realmText[info.shortName]*/}
        </div>
      </div>
    );
  }
}

export default FactionSelect;

// remove video for now for better performance.
//        <video src={`videos/${info.shortName}.webm`} poster={`videos/${info.shortName}-bg.jpg`} autoPlay loop></video>
