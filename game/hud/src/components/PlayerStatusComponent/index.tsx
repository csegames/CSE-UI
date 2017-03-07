/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {
  client,
  events,
  SVGSprite,
  ClassIcon,
  CombatLog,
  damageTypes,
} from 'camelot-unchained';
import { spring, presets, TransitionMotion } from 'react-motion';
import { generateID } from 'redux-typed-modules';

import Pills, {Orientation} from './components/Pills';
import ActiveEffectIcon from '../../components/ActiveEffectIcon'

import {PlayerStatus, BodyParts} from '../../lib/PlayerStatus';

const VALUE_PER_BODY_PARTY_PILL = 3334;
const VALUE_PER_BLOOD_PILL = 1000;
const VALUE_PER_STAMINA_PILL = 1000;

const BLOOD_REGEN_FLASH_THRESHOLD = 1;             // 1%
const STAMINA_REGEN_FLASH_THRESHOLD = 1;           // 1%
const BODY_PART_REGEN_FLASH_THRESHOLD = 1;         // 1%

const VALUE_COLOR = '#2868c7';
const VALUE_COLOR_DEAD = '#7f7f7f';
const DEPLETED_COLOR = '#3c3c3c';
const DEPLETED_COLOR_DEAD = '#4e4e4e';
const WOUND_COLOR = '#301bd0';
const WOUND_COLOR_DEAD = '#4e4e4e';


export interface DamageEvent {
  kind: 'damage';
  id: string;
  type: damageTypes;
  value: number;
  when: number;
}

export interface HealEvent {
  kind: 'heal';
  id: string;
  value: number;
  when: number;
}

type CombatEvent = DamageEvent | HealEvent;

export interface PlayerStatusComponentProps {
  containerClass?: string;
  mirror?: boolean;
  playerStatus: PlayerStatus;
  events: any;
  isLeader?: boolean;
}

export interface PlayerStatusComponentState {
  events: CombatEvent[];
}

class PlayerStatusComponent extends React.Component<PlayerStatusComponentProps, PlayerStatusComponentState> {
  constructor(props: PlayerStatusComponentProps) {
    super(props);
    this.state = {
      events: [],
    }
  }

  componentWillMount() {
    client.OnCombatLogEvent(this.parseCombatLogEvent);
  }

  componentWillUnmount() {

  }

  private parseCombatLogEvent = (combatLogs: CombatLog[]) => {
    const events: CombatEvent[] = [];
    
    combatLogs.forEach(e => {
      if (e.toName !== this.props.playerStatus.name) return;
      if (e.damages) {
        let value = 0;
        let max = 0;
        let type = damageTypes.NONE;
        e.damages.forEach(d => {
          if (d.recieved > max) {
            max = d.recieved | 0;
            type = d.type;
          }
          value += d.recieved | 0;
        });
        events.push({
          id: generateID(7),
          kind: 'damage',
          type,
          value,
          when: Date.now(),
        });
      }

      if (e.heals) {
        let value = 0;
        let max = 0;
        let type = damageTypes.NONE;
        e.heals.forEach(d => {
          if (d.recieved > max) {
            max = d.recieved | 0;
          }
          value += d.recieved | 0;
        });
        events.push({
          id: generateID(7),
          kind: 'heal',
          value,
          when: Date.now(),
        });
      }
    });

    if (events.length > 0) {
      if (this.state.events.length > 0 && (Date.now() - this.state.events[this.state.events.length-1].when) > 200) {
        this.setState({
          events,
        });
      } else {
        this.setState({
          events: this.state.events.concat(events),
        });
      }
    }
  }

  private shakeAnimationName: string = 'shakeit';
  componentWillReceiveProps(props: PlayerStatusComponentProps) {
    if (props.mirror) this.shakeAnimationName = 'shakeit-mirrored';
  }

  // Transitions
  flyTextWillLeave = (): any => {
    return {opacity: spring(0, {stiffness: 50, damping: 15, precision: 0.01}), top: spring(-120, {stiffness: 75, damping: 15, precision: 1})};
  }

  flyTextWillEnter = (): any => {
    return {opacity: 7, top: 0};
  }

  eventIconWillLeave = (): any => {
    return {opacity: spring(0, {stiffness: 50, damping: 15, precision: 0.01})};
  }

  eventIconWillEnter = (): any => {
    return {opacity: 5};
  }

  // animations
  shakeIt = () => {
    if (!this.componentRef || this.componentRef.className.indexOf(this.shakeAnimationName) != -1) return;
    this.componentRef.className += ` ${this.shakeAnimationName}`;
  }

  private endTime: number = 0;
  private componentRef: HTMLDivElement = null;
  endShake = () => {
    if (Date.now() < this.endTime) return;
    if (!this.componentRef || this.componentRef.className.indexOf(this.shakeAnimationName) == -1) return;
    this.componentRef.className = this.componentRef.className.replace(` ${this.shakeAnimationName}`, '').trim();
  }

  validPlayer = () => {
    const {playerStatus} = this.props;
    if (!playerStatus.name) return false;
    if (!playerStatus.avatar) return false;
    if (!playerStatus.race) return false;
    if (!playerStatus.gender) return false;
    if (!playerStatus.archetype) return false;
    //if (!playerStatus.characterID) return false;
    if (!playerStatus.health || playerStatus.health.length !== 6) return false;
    if (!playerStatus.wounds || playerStatus.wounds.length !== 6) return false;
    if (!playerStatus.stamina || !playerStatus.stamina.current || !playerStatus.stamina.maximum) return false;
    if (!playerStatus.blood || !playerStatus.blood.current || !playerStatus.blood.maximum) return false;
    //if (!playerStatus.panic || !playerStatus.panic.current || !playerStatus.panic.maximum) return false;
    return true;
  }

  render() {
    //if (!this.validPlayer()) return null;
    const {playerStatus} = this.props;
    const now = Date.now();
    // did we recently take damage?
    for (let i = this.state.events.length-1; i >= 0; --i) {
      const e = this.state.events[i];
      if (now - e.when > 200) break;
      if (e.kind === 'damage') {
        this.endTime = now + 200;
        setTimeout(() => this.shakeIt());
        setTimeout(() => this.endShake(), 201);
        break;
      }
    }

    const dead = this.props.playerStatus.blood.current <= 0 || 
                 this.props.playerStatus.health[BodyParts.Torso].current <= 0 ||
                 this.props.playerStatus.health[BodyParts.Head].current <= 0;

    return (
      <div className={
              `${this.props.containerClass ?
                this.props.containerClass :
                ''} PlayerStatusComponent ${this.props.mirror ? 
                  'PlayerStatusComponent--mirrored' : 
                  ''}`
           }
           ref={(r: any) => this.componentRef = r}>

        <div className='PlayerStatusComponent__circle'>

          <div className='PlayerStatusComponent__circle__bg'></div>
          <div className='PlayerStatusComponent__circle__avatar'>
            <img src={this.props.playerStatus.avatar}
                 style={dead ? {filter: 'grayscale(100%)', '-webkit-filter': 'grayscale(100%)'} : {}} />
          </div>
          
          {
            this.props.isLeader ? 
              <div className='PlayerStatusComponent__circle__leader'><img src='images/warband-leader.png' /></div>
              : null
          }


          <Pills orientation={Orientation.CircleTop}
                 containerClass='PlayerStatusComponent__circle__blood'
                 mirror={this.props.mirror}
                 valuePerPill={VALUE_PER_BLOOD_PILL}
                 currentValue={this.props.playerStatus.blood.current}
                 maxValue={this.props.playerStatus.blood.maximum}
                 flashThreshold={BLOOD_REGEN_FLASH_THRESHOLD}
                 valueColor={dead ? VALUE_COLOR_DEAD : 'red'}
                 depletedColor={dead ? DEPLETED_COLOR_DEAD : DEPLETED_COLOR} />


          <Pills orientation={Orientation.CircleBottom}
                 containerClass='PlayerStatusComponent__circle__blood'
                 mirror={this.props.mirror}
                 valuePerPill={VALUE_PER_STAMINA_PILL}
                 currentValue={this.props.playerStatus.stamina.current}
                 maxValue={this.props.playerStatus.stamina.maximum}
                 flashThreshold={STAMINA_REGEN_FLASH_THRESHOLD}
                 valueColor={dead ? VALUE_COLOR_DEAD : 'yellow'}
                 depletedColor={dead ? DEPLETED_COLOR_DEAD : DEPLETED_COLOR} />


          <TransitionMotion willLeave={this.eventIconWillLeave}
                            willEnter={this.eventIconWillEnter}
                            styles={this.state.events.map(e => ({
                              key: e.id,
                              data: e,
                              style: {opacity: spring(0), r: Math.random() * 90 - 45}
                            }))}>
            {(interpolatedStyles: any) =>
              <div className='PlayerStatusComponent__circle__eventIcon'>
                {interpolatedStyles.map((config: any) => {
                  return <div className={`PlayerStatusComponent__circle__eventIcon--piercing`}
                              key={config.key}
                              style={{opacity: config.style.opacity, transform: `rotateZ(${config.style.r}deg)`}}/>
                })}
              </div>
            }
          </TransitionMotion>

          <TransitionMotion willLeave={this.flyTextWillLeave}
                            willEnter={this.flyTextWillEnter}
                            styles={this.state.events.map(e => ({
                              key: e.id,
                              data: e,
                              style: {opacity: spring(0), top: spring(-140)}
                            }))}>
            {(interpolatedStyles: any) =>
              <div className='PlayerStatusComponent__circle__flyText'>
                {interpolatedStyles.map((config: any) => {
                  return (
                    <div className={
                          `PlayerStatusComponent__circle__flyText--${config.data.kind} ${this.props.mirror ?
                            'PlayerStatusComponent--mirrored' :
                            ''}`
                         }
                         key={config.key}
                         style={{opacity: config.style.opacity, top: config.style.top}}>
                      {config.data.value}
                    </div>
                  )
                })}
              </div>
            }
          </TransitionMotion>

        </div>

        <div className='PlayerStatusComponent__healthBars'>

          <ul className='PlayerStatusComponent__healthBars__labels'>
            <li className={`outer ${this.props.mirror ? 'PlayerStatusComponent--mirrored' : ''}`}>RA</li>
            <li className={`inner ${this.props.mirror ? 'PlayerStatusComponent--mirrored' : ''}`}>LA</li>
            <li className={`${this.props.mirror ? 'PlayerStatusComponent--mirrored' : ''}`}>&nbsp;H</li>
            <li className={`${this.props.mirror ? 'PlayerStatusComponent--mirrored' : ''}`}>&nbsp;T</li>
            <li className={`inner ${this.props.mirror ? 'PlayerStatusComponent--mirrored' : ''}`} >RL</li>
            <li className={`outer ${this.props.mirror ? 'PlayerStatusComponent--mirrored' : ''}`} style={{left: '-7px'}}>LL</li>
          </ul>

          <Pills orientation={Orientation.Horizontal}
                 containerClass='PlayerStatusComponent__healthBars__bodyPart'
                 ref='right-arm'
                 mirror={this.props.mirror}
                 valuePerPill={VALUE_PER_BODY_PARTY_PILL}
                 currentValue={this.props.playerStatus.health[BodyParts.RightArm].current}
                 maxValue={this.props.playerStatus.health[BodyParts.RightArm].maximum}
                 flashThreshold={BODY_PART_REGEN_FLASH_THRESHOLD}
                 valueColor={dead ? VALUE_COLOR_DEAD : VALUE_COLOR}
                 depletedColor={dead ? DEPLETED_COLOR_DEAD : DEPLETED_COLOR}
                 wounds={this.props.playerStatus.wounds[BodyParts.RightArm]}
                 woundColor={dead ? WOUND_COLOR_DEAD : WOUND_COLOR}
                 />

          <Pills orientation={Orientation.Horizontal}
                 containerClass='PlayerStatusComponent__healthBars__bodyPart'
                 ref='left-arm'
                 mirror={this.props.mirror}
                 valuePerPill={VALUE_PER_BODY_PARTY_PILL}
                 currentValue={this.props.playerStatus.health[BodyParts.LeftArm].current}
                 maxValue={this.props.playerStatus.health[BodyParts.LeftArm].maximum}
                 flashThreshold={BODY_PART_REGEN_FLASH_THRESHOLD}
                 valueColor={dead ? VALUE_COLOR_DEAD : VALUE_COLOR}
                 depletedColor={dead ? DEPLETED_COLOR_DEAD : DEPLETED_COLOR}
                 wounds={this.props.playerStatus.wounds[BodyParts.LeftArm]}
                 woundColor={dead ? WOUND_COLOR_DEAD : WOUND_COLOR}
                 />

          <Pills orientation={Orientation.Horizontal}
                 containerClass='PlayerStatusComponent__healthBars__bodyPart'
                 ref='head'
                 mirror={this.props.mirror}
                 valuePerPill={VALUE_PER_BODY_PARTY_PILL}
                 currentValue={this.props.playerStatus.health[BodyParts.Head].current}
                 maxValue={this.props.playerStatus.health[BodyParts.Head].maximum}
                 flashThreshold={BODY_PART_REGEN_FLASH_THRESHOLD}
                 valueColor={dead ? VALUE_COLOR_DEAD : '#0093e8'}
                 depletedColor={dead ? DEPLETED_COLOR_DEAD : DEPLETED_COLOR}
                 wounds={this.props.playerStatus.wounds[BodyParts.Head]}
                 woundColor={dead ? WOUND_COLOR_DEAD : WOUND_COLOR}
                 />

          <Pills orientation={Orientation.Horizontal}
                 containerClass='PlayerStatusComponent__healthBars__bodyPart'
                 ref='torso'
                 mirror={this.props.mirror}
                 valuePerPill={VALUE_PER_BODY_PARTY_PILL}
                 currentValue={this.props.playerStatus.health[BodyParts.Torso].current}
                 maxValue={this.props.playerStatus.health[BodyParts.Torso].maximum}
                 flashThreshold={BODY_PART_REGEN_FLASH_THRESHOLD}
                 valueColor={dead ? VALUE_COLOR_DEAD : '#0093e8'}
                 depletedColor={dead ? DEPLETED_COLOR_DEAD : DEPLETED_COLOR}
                 wounds={this.props.playerStatus.wounds[BodyParts.Torso]}
                 woundColor={dead ? WOUND_COLOR_DEAD : WOUND_COLOR}
                 />

          <Pills orientation={Orientation.Horizontal}
                 containerClass='PlayerStatusComponent__healthBars__bodyPart'
                 ref='right-leg'
                 mirror={this.props.mirror}
                 valuePerPill={VALUE_PER_BODY_PARTY_PILL}
                 currentValue={this.props.playerStatus.health[BodyParts.RightLeg].current}
                 maxValue={this.props.playerStatus.health[BodyParts.RightLeg].maximum}
                 flashThreshold={BODY_PART_REGEN_FLASH_THRESHOLD}
                 valueColor={dead ? VALUE_COLOR_DEAD : VALUE_COLOR}
                 depletedColor={dead ? DEPLETED_COLOR_DEAD : DEPLETED_COLOR}
                 wounds={this.props.playerStatus.wounds[BodyParts.RightLeg]}
                 woundColor={dead ? WOUND_COLOR_DEAD : WOUND_COLOR}
                 />

          <Pills orientation={Orientation.Horizontal}
                 containerClass='PlayerStatusComponent__healthBars__bodyPart'
                 ref='left-leg'
                 mirror={this.props.mirror}
                 valuePerPill={VALUE_PER_BODY_PARTY_PILL}
                 currentValue={this.props.playerStatus.health[BodyParts.LeftLeg].current}
                 maxValue={this.props.playerStatus.health[BodyParts.LeftLeg].maximum}
                 flashThreshold={BODY_PART_REGEN_FLASH_THRESHOLD}
                 valueColor={dead ? VALUE_COLOR_DEAD : VALUE_COLOR}
                 depletedColor={dead ? DEPLETED_COLOR_DEAD : DEPLETED_COLOR}
                 wounds={this.props.playerStatus.wounds[BodyParts.LeftLeg]}
                 woundColor={dead ? WOUND_COLOR_DEAD : WOUND_COLOR}
                 />

        </div>

        <div className={`PlayerStatusComponent__name ${this.props.mirror ? 'PlayerStatusComponent--mirrored' : ''}`} >
          {this.props.playerStatus.name}
        </div>

      </div>
    );
  }
}

export default PlayerStatusComponent;
