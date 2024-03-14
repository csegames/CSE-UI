/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { includes } from 'lodash';

import PlayerClassVisualEffects from './PlayerClassVisualEffects';
import { ArchetypeInfo, Faction, FactionInfo, RaceInfo } from '../../../../api/webapi';
import { getFactionMedia } from '../../../../lib/characterImages';
import { Race, Gender } from '../../../../api/helpers';
import { Sound, playSound } from '../../../../lib/Sound';

export interface PlayerClassSelectProps {
  classes: ArchetypeInfo[];
  selectedGender: Gender;
  selectedRace: RaceInfo;
  selectedClass: ArchetypeInfo;
  selectedFaction: FactionInfo;
  selectClass: (playerClass: ArchetypeInfo) => void;
}

export interface PlayerClassSelectState {
  helpEnabled: boolean;
}

class PlayerClassSelect extends React.Component<PlayerClassSelectProps, PlayerClassSelectState> {
  constructor(props: PlayerClassSelectProps) {
    super(props);
    this.state = {
      helpEnabled: false
    };
  }

  public render() {
    if (!this.props.classes) return <div> loading classes</div>;

    let text: any = null;
    let name: any = null;
    if (this.props.selectedClass) {
      name = <h2 className='display-name'>{this.props.selectedClass.name}</h2>;
      text = <div className='selection-description player-class-s-d'>{this.props.selectedClass.description}</div>;
    }
    const displayedClasses = this.props.classes.filter(
      (c: ArchetypeInfo) => c.faction === this.props.selectedFaction.id || c.faction === Faction.Factionless
    );

    const [src, poster] = getFactionMedia(this.props.selectedFaction.id);
    return (
      <div className='page'>
        <PlayerClassVisualEffects
          selectedClass={this.props.selectedClass}
          selectedRace={this.props.selectedRace}
          selectedFaction={this.props.selectedFaction}
          selectedGender={this.props.selectedGender}
        />
        <video src={src} poster={poster} autoPlay loop></video>
        {name}
        <div className='selection-box'>
          <h6>Choose your class</h6>
          <div className='class-selection-container'>{displayedClasses.map(this.generateClassContent.bind(this))}</div>
          {text}
        </div>
      </div>
    );
  }

  private selectClass = (info: ArchetypeInfo) => {
    playSound(Sound.Select);
    this.props.selectClass(info);
  };

  private generateClassContent(info: ArchetypeInfo, index: number) {
    const { selectedRace, selectedGender, selectedClass } = this.props;
    const raceVal = Race[selectedRace.stringID as keyof typeof Race];
    const race = includes(raceVal.toLowerCase(), 'human') ? 'Human' : raceVal;
    const active = selectedClass != null && selectedClass.id == info.id;
    const className = `class-btn thumb__${race}_${Gender[selectedGender]}_${info.stringID} ${active ? 'active' : ''}`;
    return <div key={info.id} className={className} onClick={this.selectClass.bind(this, info)}></div>;
  }
}

export default PlayerClassSelect;
