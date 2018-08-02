/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled, { css } from 'react-emotion';
import { SkillStateStatusEnum } from '@csegames/camelot-unchained';

import { showTooltip, hideTooltip } from 'actions/tooltips';
import { overlayPseudo } from './lib/styles';
import {
  SkillStateInfo,
  ReadyState,
  HeldState,
  QueuedState,
  RunningState,
  CooldownState,
  ErrorState,
  ChannelState,
  RecoveryState,
  PreparationState,
  StartCastState,
  HitState,
  InterruptedState,
  ModalState,
  UnavailableState,
  NoAmmoState,
  NoWeaponState,
  CLASS_NAMES,
} from './lib';

const Button = styled('div')`
  position: relative;
  width: 50px;
  height: 50px;
  flex-grow: 0;
  flex-shrink: 0;
  margin: 5px;
  border: 1px solid #111;
  border-radius: 100%;
  background-size: contain;
  pointer-events: all;
  cursor: pointer;

  &:hover,
  &:active {
    border: 1px solid rgba(0, 0, 0, 0.8);
    box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.5);
  }

  .inner-bg {
    stroke: transparent;
    transition: all 0.2s ease-in-out;
    -webkit-transition: all 0.2s ease-in-out;
  }

  .outer-bg {
    stroke: #111;
  }

  svg {
    position: absolute;
    left: -5px;
    top: -5px;
    z-index: 1;
    pointer-events: none;
  }

  &.${CLASS_NAMES.READY_STATE} {
    ${ReadyState}
  }

  &.${CLASS_NAMES.HELD_STATE} {
    ${HeldState}
  }

  &.${CLASS_NAMES.QUEUED_STATE} {
    ${QueuedState}
  }

  &.${CLASS_NAMES.RUNNING_STATE} {
    ${RunningState}
  }

  &.${CLASS_NAMES.COOLDOWN_STATE} {
    ${CooldownState}
  }

  &.${CLASS_NAMES.ERROR_STATE} {
    ${ErrorState}
  }

  &.${CLASS_NAMES.CHANNEL_STATE} {
    ${ChannelState}
  }

  &.${CLASS_NAMES.RECOVERY_STATE} {
    ${RecoveryState}
  }

  &.${CLASS_NAMES.PREPARATION_STATE} {
    ${PreparationState}
  }

  &.${CLASS_NAMES.START_CAST_STATE} {
    ${StartCastState}
  }

  &.${CLASS_NAMES.HIT_STATE} {
    ${HitState}
  }

  &.${CLASS_NAMES.INTERRUPTED_STATE} {
    ${InterruptedState}
  }

  &.${CLASS_NAMES.MODAL_STATE} {
    ${ModalState}
  }

  &.${CLASS_NAMES.UNAVAILABLE_STATE} {
    ${UnavailableState}
  }

  &.${CLASS_NAMES.NO_AMMO_STATE} {
    ${NoAmmoState}
  }

  &.${CLASS_NAMES.NO_WEAPON_STATE} {
    ${NoWeaponState}
  }
`;

const KeybindInfo = styled('div')`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 100%;
  width: 100%;
  color: #ececec;
  text-align: center;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 5px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0) 30px, rgba(0, 0, 0, 0) 30px);
  border-radius: 0 0 600% 600%;
  font-weight: 600;
  text-shadow: -2px -2px 2px #000, 2px -2px 2px #000, -2px 2px 2px #000, 2px 2px 2px #000;
  font-size: 0.6em;
`;

const TimingOverlay = styled('div')`
  ${overlayPseudo};
  display: flex;
  justify-content: center;
  font-size: 1em;
  line-height: 2em;
  text-shadow: -1px -1px 1px #000, 1px -1px 1px #000, -1px 1px 1px #000, 1px 1px 1px #000;
  color: white;
  filter: brightness(120%);
`;

const QueuedStateTick = styled('div')`
  position: absolute;
  top: -2px;
  left: -2px;
  width: 120%;
  height: 120%;
  z-index: 3;
  border-radius: 0;
  box-shadow: initial;
  background: url(images/skills/queued-tick.png) no-repeat;
  background-size: 90%;
`;

const TooltipHeader = styled('div')`
  font-size: 22px;
  font-weight: 700;
`;

const TooltipContentContainer = styled('div')`
  color: white;
`;

const DefaultTooltipStyles = {
  tooltip: css`
    padding: 2px 5px 5px 5px;
    background-color: rgba(0,0,0,0.9);
    min-width: 200px;
    max-width: 300px;
    max-height: 750px;
  `,
};

export interface SkillButtonViewProps {
  skillState: SkillStateInfo;
  name: string;
  description: string;
  timer: string;
  outer: string;
  outerPath: string;
  inner: string;
  innerPath: string;
  className: string;
  onSkillClick: () => void;
}

export interface SkillButtonViewState {

}

class SkillButtonView extends React.Component<SkillButtonViewProps, SkillButtonViewState> {
  public render() {
    // output button
    const { skillState } = this.props;
    const icon = { backgroundImage: 'url(' + skillState.info.icon + ')' };
    return (
      <Button
        id={skillState.id}
        className={this.props.className}
        style={icon}
        onClick={this.props.onSkillClick}
        onMouseOver={this.onMouseOver}
        onMouseLeave={this.onMouseLeave}
      >
        <KeybindInfo>{skillState.info.keybind}</KeybindInfo>
        {skillState.status & SkillStateStatusEnum.Queued ? <QueuedStateTick /> : null}
        <svg width='100' height='100'>
          <path d={this.props.outer} fill='none' strokeWidth='3px' className='outer-bg-blur'></path>
          <path d={this.props.outer} fill='none' strokeWidth='3px' className='outer-bg'></path>
          <path d={this.props.outerPath} fill='none' strokeWidth='3px' className='outer-blur'></path>
          <path d={this.props.outerPath} fill='none' strokeWidth='3px' className='outer'></path>
          <path d={this.props.inner} fill='none' strokeWidth='3px' className='inner-bg-blur'></path>
          <path d={this.props.inner} fill='none' strokeWidth='3px' className='inner-bg'></path>
          <path d={this.props.innerPath} fill='none' strokeWidth='3px' className='inner-blur'></path>
          <path d={this.props.innerPath} fill='none' strokeWidth='3px' className='inner'></path>
        </svg>
        {Number(this.props.timer) !== 0 &&
          <TimingOverlay className='skill-timing-overlay'>
            {this.props.timer}
          </TimingOverlay>
        }
      </Button>
    );
  }

  public shouldComponentUpdate(nextProps: SkillButtonViewProps) {
    return nextProps.timer !== this.props.timer ||
      nextProps.inner !== this.props.inner ||
      nextProps.innerPath !== this.props.innerPath ||
      nextProps.outer !== this.props.outer ||
      nextProps.outerPath !== this.props.outerPath ||
      !_.isEqual(nextProps.skillState, this.props.skillState) ||
      nextProps.className !== this.props.className;
  }

  private onMouseOver = (event: React.MouseEvent<HTMLDivElement>) => {
    const content = <TooltipContentContainer>
      <TooltipHeader>{this.props.name}</TooltipHeader>
      <div dangerouslySetInnerHTML={{ __html: this.props.description }} />
    </TooltipContentContainer>;
    showTooltip({ content, event, styles: DefaultTooltipStyles });
  }

  private onMouseLeave = () => {
    hideTooltip();
  }
}

export default SkillButtonView;
