/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled from 'react-emotion';
import { Tooltip, SkillStateStatusEnum } from '@csegames/camelot-unchained';
import { overlayPseudo } from './lib/styles';

import { SkillStateInfo } from './lib';

const Button = styled('div')`
  position: relative;
  width: 50px;
  height: 50px;
  flex-grow: 0;
  flex-shrink: 0;
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

  &:after {
    content: "${(props: any) => props.keybind}";
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
  background: url(http://i.imgur.com/U4GWSJN.png) no-repeat;
  background-size: 90%;
`;

const TooltipHeader = styled('header')`
  font-size: 22px;
  font-weight: 700;
`;

export interface SkillButtonViewProps {
  skillState: SkillStateInfo;
  name: string;
  description: string;
  timer: string;
  outer: string;
  outerPath: string;
  inner: string;
  innerPath: string;
  classNames: string;
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
      <Tooltip
        styles={{
          Tooltip: {
            margin: '5px',
          },
          tooltip: {
            backgroundColor: 'rgba(0,0,0,0.9)',
            minWidth: '200px',
            maxWidth: '300px',
            maxHeight: '750px',
          },
        }}
        content={() => (
          <div>
            <TooltipHeader>{this.props.name}</TooltipHeader>
            <div dangerouslySetInnerHTML={{ __html: this.props.description }} />
          </div>
        )}
      >
        <Button
          id={skillState.id}
          className={this.props.classNames}
          style={icon}
          keybind={skillState.info.keybind}
          onClick={this.props.onSkillClick}
        >
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
      </Tooltip>
    );
  }

  public shouldComponentUpdate(nextProps: SkillButtonViewProps) {
    return nextProps.timer !== this.props.timer ||
      nextProps.inner !== this.props.inner ||
      nextProps.innerPath !== this.props.innerPath ||
      nextProps.outer !== this.props.outer ||
      nextProps.outerPath !== this.props.outerPath ||
      !_.isEqual(nextProps.skillState, this.props.skillState) ||
      nextProps.classNames !== this.props.classNames;
  }
}

export default SkillButtonView;
