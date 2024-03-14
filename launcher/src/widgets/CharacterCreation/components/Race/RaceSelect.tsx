/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import { FactionInfo, RaceInfo } from '../../../../api/webapi';
import { Race, Gender } from '../../../../api/helpers';
import RaceVisualEffects from './RaceVisualEffects';
import Animate from '../../../../lib/Animate';
import { Sound, playSound } from '../../../../lib/Sound';

export interface RaceSelectProps {
  selectedFaction: FactionInfo;
  races: RaceInfo[];
  selectedRace: RaceInfo;
  selectRace: (race: RaceInfo) => void;
  selectedGender: Gender;
  selectGender: (selected: Gender) => void;
}

export interface RaceSelectState {
  helpEnabled: boolean;
}

class RaceSelect extends React.Component<RaceSelectProps, RaceSelectState> {
  constructor(props: RaceSelectProps) {
    super(props);
    this.state = {
      helpEnabled: false
    };
  }

  public render() {
    if (!this.props.races) return <div>loading races</div>;

    let text: any = null;
    let name: any = null;
    if (this.props.selectedRace) {
      name = <h2 className='display-name'>{this.props.selectedRace.name}</h2>;
      text = <div className='selection-description'>{this.props.selectedRace.description}</div>;
    }
    return (
      <div className='page'>
        <RaceVisualEffects
          selectedRace={this.props.selectedRace}
          selectedFaction={this.props.selectedFaction}
          selectedGender={this.props.selectedGender}
        />
        {name}
        <div className='selection-box'>
          <h6>Choose your race</h6>
          <div className='race-selection-container'>
            {this.props.races
              .filter((r: any) => r.faction === this.props.selectedFaction.id)
              .map(this.generateRaceContent)}
          </div>
          <h6>Choose your gender</h6>
          <div className='gender-selection-container'>
            <a
              id='male-btn'
              className={`gender-btn ${this.props.selectedGender === Gender.Male ? 'selected' : ''}`}
              onClick={() => this.selectGender(Gender.Male)}
            >
              Male
            </a>
            <a
              className={`gender-btn ${this.props.selectedGender === Gender.Female ? 'selected' : ''}`}
              onClick={() => this.selectGender(Gender.Female)}
            >
              Female
            </a>
          </div>
          {text}
        </div>
        <div className='view-content'>
          <Animate
            className='animate'
            animationEnter='fadeIn'
            animationLeave='fadeOut'
            durationEnter={400}
            durationLeave={500}
          ></Animate>
        </div>
      </div>
    );
  }

  private selectRace = (race: RaceInfo) => {
    this.props.selectRace(race);
    playSound(Sound.Select);
  };

  private generateRaceContent = (info: RaceInfo, index: number) => {
    return (
      <div
        key={info.id}
        className={`race-btn thumb__${Race[info.stringID as keyof typeof Race]}--${Gender[this.props.selectedGender]}
          ${this.props.selectedRace !== null ? (this.props.selectedRace.id === info.id ? 'active' : '') : ''}`}
        onClick={this.selectRace.bind(this, info)}
      ></div>
    );
  };

  private selectGender = (gender: Gender) => {
    this.props.selectGender(gender);
    playSound(Sound.Select);
  };
}

export default RaceSelect;
