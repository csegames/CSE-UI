/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {client, Archetype, Race, Gender, SVGSprite, ClassIcon} from 'camelot-unchained';

import Pills, {Orientation} from './components/Pills';
import PlayerPhoto from './components/PlayerPhoto';
import SlideIndicatorBar from './components/SlideIndicatorBar';
import ActiveEffectIcon from '../../components/ActiveEffectIcon'

export enum PlayerStatusStyle {
  FullSelf,
  FullTarget,
  FullParty,
  MiniSelf,
  MiniTarget,
  MiniParty,
}

export interface PlayerStatus {
  name: string;
  race: Race;
  gender: Gender;
  archetype: Archetype;
  characterID: string;
  health: [{
    current: number,
    maximum: number
  }];
  stamina: {
    current: number,
    maximum: number
  };
  blood: {
    current: number,
    maximum: number
  };
  panic: {
    current: number,
    maximum: number
  };
  temperature: {
    current: number,
    maximum: number,
    minimum: number
  };
}

export enum BodyParts {
  Torso,
  Head,
  LeftArm,
  RightArm,
  LeftLeg,
  RightLeg
}

export interface PlayerStatusBarProps {
  containerClass?: string;
  style: PlayerStatusStyle;
  playerStatus: PlayerStatus;
  isLeader?: boolean;
}

export interface PlayerStatusBarState {
}

class PlayerStatusBar extends React.Component<PlayerStatusBarProps, PlayerStatusBarState> {

  constructor(props: PlayerStatusBarProps) {
    super(props);
  }

  bodyParts = (style: string = 'left') : any => {
    const mini = style === 'mini' || style === 'mini-party';
    const health = this.props.playerStatus.health;
    return (
      <div className={`player-status-bar__body-parts ${style}`}>
          
          <div className='player-status-bar__body-parts__part'
               style={mini ? {} : {marginBottom:'8%'}}>
            <div className={`player-status-bar__body-parts__label ${style}`}>LA</div>
            <Pills currentValue={health[BodyParts.LeftArm].current}
                   valuePerPill={100}
                   maxValue={health[BodyParts.LeftArm].maximum}
                   displayWounds={true}
                   woundColor={'#ff4444'}
                   valueColor={'#0072ff'}
                   depletedColor={'black'}
                   containerClass={'player-status-bar__body-parts__pills'}
                   pillClass={mini ? 'player-status-bar__body-parts__pill' : 'player-status-bar__body-parts__pill--left'}
                   size={10}
                   orientation={Orientation.Vertical} />
          </div>

          <div className='player-status-bar__body-parts__part'
               style={mini ? {} : {marginBottom:'2%', marginTop:'6%'}}>
            <div className={`player-status-bar__body-parts__label ${style}`}>LL</div>
            <Pills currentValue={health[BodyParts.LeftLeg].current}
                   valuePerPill={100}
                   maxValue={health[BodyParts.LeftLeg].maximum}
                   displayWounds={true}
                   woundColor={'#ff4444'}
                   valueColor={'#0072ff'}
                   depletedColor={'black'}
                   containerClass={'player-status-bar__body-parts__pills'}
                   pillClass={mini ? 'player-status-bar__body-parts__pill' : 'player-status-bar__body-parts__pill--left'}
                   size={10}
                   orientation={Orientation.Vertical} />
          </div>

          <div className='player-status-bar__body-parts__part'
               style={mini ? {} : {marginTop:'13%'}}>
            <div className={`player-status-bar__body-parts__label ${style}`}
                 style={mini ? {fontWeight:'bold'} : {fontWeight:'bold',marginBottom:'0px'}}>H</div>
            <Pills currentValue={health[BodyParts.Head].current}
                   valuePerPill={100}
                   maxValue={health[BodyParts.Head].maximum}
                   displayWounds={true}
                   woundColor={'#ff4444'}
                   valueColor={'#0072ff'}
                   depletedColor={'black'}
                   containerClass={'player-status-bar__body-parts__pills'}
                   size={10}
                   orientation={Orientation.Vertical} />
          </div>

          <div className='player-status-bar__body-parts__part'
               style={mini ? {} : {marginTop:'13%'}}>
            <div className={`player-status-bar__body-parts__label ${style}`}
                 style={mini ? {fontWeight:'bold'} : {fontWeight:'bold',marginBottom:'0px'}}>T</div>
            <Pills currentValue={health[BodyParts.Torso].current}
                   valuePerPill={100}
                   maxValue={health[BodyParts.Torso].maximum}
                   displayWounds={true}
                   woundColor={'#ff4444'}
                   valueColor={'#0072ff'}
                   depletedColor={'black'}
                   containerClass={'player-status-bar__body-parts__pills'}
                   size={10}
                   orientation={Orientation.Vertical} />
          </div>

          <div className='player-status-bar__body-parts__part'
               style={mini ? {} : {marginBottom:'2%',marginTop:'6%'}}>
            <div className={`player-status-bar__body-parts__label ${style}`}>RL</div>
            <Pills currentValue={health[BodyParts.RightLeg].current}
                   valuePerPill={100}
                   maxValue={health[BodyParts.RightLeg].maximum}
                   displayWounds={true}
                   woundColor={'#ff4444'}
                   valueColor={'#0072ff'}
                   depletedColor={'black'}
                   containerClass={'player-status-bar__body-parts__pills'}
                   pillClass={mini ? 'player-status-bar__body-parts__pill' :  'player-status-bar__body-parts__pill--right'}
                   size={10}
                   orientation={Orientation.Vertical} />
          </div>

          <div className='player-status-bar__body-parts__part'
               style={mini ? {} : {marginBottom:'8%'}}>
            <div className={`player-status-bar__body-parts__label ${style}`}>RA</div>
            <Pills currentValue={health[BodyParts.RightArm].current}
                   valuePerPill={100}
                   maxValue={health[BodyParts.RightArm].maximum}
                   displayWounds={true}
                   woundColor={'#ff4444'}
                   valueColor={'#0072ff'}
                   depletedColor={'black'}
                   containerClass={'player-status-bar__body-parts__pills'}
                   pillClass={mini ? 'player-status-bar__body-parts__pill' :  'player-status-bar__body-parts__pill--right'}
                   size={10}
                   orientation={Orientation.Vertical} />
          </div>

        </div>
    )
  }

  portrait = (url: string, style: string = 'left'): any => {
    return <PlayerPhoto photo={url} containerClass={`player-status-bar__portrait ${style}`}/>;
  }

  bloodAndStamFull = (position: string = 'left'): any => {
    return (
      <div className={`player-status-bar__blood-and-stam ${position}`}>
        <div className='player-status-bar__column'>
          <Pills currentValue={this.props.playerStatus.blood.current}
                 valuePerPill={100}
                 maxValue={this.props.playerStatus.blood.maximum}
                 valueColor={'red'}
                 depletedColor={'grey'}
                 containerClass={'player-status-bar__blood'}
                 size={10} />

          <div className='player-status-bar__label'>{`${this.props.playerStatus.blood.current}/${this.props.playerStatus.blood.maximum}`}</div>

          <SlideIndicatorBar containerClass='player-status-bar__panic-bar'
                             indicatorClass='player-status-bar__indicator'
                             currentValue={this.props.playerStatus.panic.current}
                             maxValue={this.props.playerStatus.panic.maximum} />

        </div>

        <div className='player-status-bar__column'>
          <Pills currentValue={this.props.playerStatus.stamina.current}
                 valuePerPill={100}
                 maxValue={this.props.playerStatus.stamina.current}
                 valueColor={'yellow'}
                 depletedColor={'grey'}
                 containerClass={'player-status-bar__stamina'}
                 size={10} />

          <div className='player-status-bar__label'>{`${this.props.playerStatus.stamina.current}/${this.props.playerStatus.stamina.maximum}`}</div>

          <SlideIndicatorBar containerClass='player-status-bar__temp-bar'
                             indicatorClass='player-status-bar__indicator'
                             currentValue={this.props.playerStatus.temperature.current}
                             maxValue={this.props.playerStatus.temperature.maximum} />
        </div>
      </div>
    );
  }

  bloodAndStamParty = (style: string = 'left'): any => {
    return (
      <div className={`player-status-bar__blood-and-stam ${style}`}>
        <div className='player-status-bar__column'>
          <Pills currentValue={this.props.playerStatus.blood.current}
                 valuePerPill={100}
                 maxValue={this.props.playerStatus.blood.maximum}
                 valueColor={'red'}
                 depletedColor={'grey'}
                 containerClass={'player-status-bar__blood'}
                 size={10} />

          <Pills currentValue={this.props.playerStatus.stamina.current}
                 valuePerPill={100}
                 maxValue={this.props.playerStatus.stamina.maximum}
                 valueColor={'yellow'}
                 depletedColor={'grey'}
                 containerClass={'player-status-bar__stamina'}
                 size={10} />
          
          <SlideIndicatorBar containerClass='player-status-bar__panic-bar'
                             indicatorClass='player-status-bar__indicator'
                             currentValue={this.props.playerStatus.panic.current}
                             maxValue={this.props.playerStatus.panic.maximum} />

          <SlideIndicatorBar containerClass='player-status-bar__temp-bar'
                             indicatorClass='player-status-bar__indicator'
                             currentValue={this.props.playerStatus.temperature.current}
                             maxValue={this.props.playerStatus.temperature.maximum} />
        </div>
      </div>
    );
  }

  classIcon = (style: string = 'left'): any => {
    return (
      <div className={`player-status-bar__class ${style}`}>
        <ClassIcon playerClass={this.props.playerStatus.archetype} />
      </div>
    );
  }

  name = (style: string = 'left'): any => {
    return (
      <div className={`player-status-bar__name ${style}`}>CSE JB</div>
    );
  }

  activeEffects = (style: string = 'left'): any => {
    return (
      <div className={`PlayerStatusBar__ActiveEffects ${style}`}>
        <ActiveEffectIcon containerClass={`PlayerStatusBar__ActiveEffects__Icon ${style}`}
                          icon='http://s3.amazonaws.com/camelot-unchained/icons/components/120/light-smash.jpg' />
        <ActiveEffectIcon containerClass={`PlayerStatusBar__ActiveEffects__Icon ${style}`} 
                          icon='http://s3.amazonaws.com/camelot-unchained/icons/components/120/light-smash.jpg' />
        <ActiveEffectIcon containerClass={`PlayerStatusBar__ActiveEffects__Icon ${style}`}
                          icon='http://s3.amazonaws.com/camelot-unchained/icons/components/120/light-smash.jpg' />
                          <ActiveEffectIcon containerClass={`PlayerStatusBar__ActiveEffects__Icon ${style}`}
                          icon='http://s3.amazonaws.com/camelot-unchained/icons/components/120/light-smash.jpg' />
                          <ActiveEffectIcon containerClass={`PlayerStatusBar__ActiveEffects__Icon ${style}`}
                          icon='http://s3.amazonaws.com/camelot-unchained/icons/components/120/light-smash.jpg' />
      </div>
    );
  }

  fullSelf = (): any => {
    return (
      <div className={`player-status-bar ${this.props.containerClass || ''}`} >

        <SVGSprite sprite='images/player-status-bar.svg#bg'
                   svgClass='player-status-bar--background' />

        {this.name()}
        {this.classIcon()}
        {this.portrait('images/csejb.png')}
        {this.bloodAndStamFull()}
        {this.bodyParts()}
        {this.activeEffects()}

      </div>
    );
  }

  fullTarget = (): any => {
    return (
      <div className={`player-status-bar ${this.props.containerClass || ''}`} >
        
        <SVGSprite sprite='images/player-status-bar.svg#target-bg'
                   svgClass='player-status-bar--background' />

        {this.name('right')}
        {this.classIcon('right')}
        {this.portrait('images/csejb.png', 'right')}
        {this.bloodAndStamFull('right')}
        {this.bodyParts('right')}
        {this.activeEffects('right')}
      
      </div>
    );
  }

  fullParty = (): any => {
    return (
      <div className={`player-status-bar ${this.props.containerClass || ''}`} >
        
        <SVGSprite sprite='images/player-status-bar.svg#bg-mini'
                   svgClass='player-status-bar--background' />
        
        {this.name()}
        {this.classIcon()}
        {this.portrait('images/csejb.png')}
        {this.bloodAndStamParty()}
        {this.bodyParts()}
        {this.activeEffects('party')}
      
      </div>
    )
  }

  miniSelf = (): any => {
    return (
      <div className={`player-status-bar ${this.props.containerClass || ''}`}>

        {this.name('mini')}
        {this.classIcon('mini')}
        {this.portrait('images/csejb.png', 'mini')}
        {this.bloodAndStamParty('mini')}
        {this.bodyParts('mini')}
        {this.activeEffects('mini')}

      </div>
    )
  }

  miniParty = (): any => {
    return (
      <div className={`player-status-bar ${this.props.containerClass || ''}`}>

        {this.name('mini-party')}
        {this.classIcon('mini')}
        {this.bloodAndStamParty('mini-party')}
        {this.bodyParts('mini-party')}
        {this.activeEffects('mini')}

      </div>
    )
  }

  miniTarget = (): any => {
    return (
      <div className={`player-status-bar ${this.props.containerClass || ''}`}>

        {this.name('mini-party')}
        {this.classIcon('mini')}
        {this.bloodAndStamParty('mini-party')}
        {this.bodyParts('mini-party')}
        {this.activeEffects('mini')}

      </div>
    )
  }

  render() {
    switch(this.props.style) {
      case PlayerStatusStyle.FullSelf: return this.fullSelf();
      case PlayerStatusStyle.FullTarget: return this.fullTarget();
      case PlayerStatusStyle.FullParty: return this.fullParty();
      case PlayerStatusStyle.MiniSelf: return this.miniSelf();
      case PlayerStatusStyle.MiniParty: return this.miniParty();
      case PlayerStatusStyle.MiniTarget: return this.miniTarget();
      default: return null;
    }
  }
}

export default PlayerStatusBar;
