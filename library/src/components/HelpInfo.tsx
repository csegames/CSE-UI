/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';
import styled, { css } from 'react-emotion';
import Animate from './Animate';

import Tooltip from './Tooltip';
import { darkenColor } from '../utils';

const HelpContainer: any = styled('div')`
  position: fixed;
  top: ${(props: any) => props.top}px;
  left: ${(props: any) => props.left}px;
  width: ${(props: any) => props.width}px;
  height: ${(props: any) => props.height}px;
  z-index: 999;
  pointer-events: none;
  background-color: rgba(255,255,255,0.1);
  box-shadow: inset 0 0 5px 5px rgba(255,255,255,0.4);
  pointer-events: none;
`;

const HelpOverlay: any = styled('div')`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 998;
  pointer-events: none;
  background-color: rgba(0,0,0,0.5);
`;

const TooltipIcon: any = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: ${(props: any) => `${props.top - 5}px`};
  left: ${(props: any) => `${props.left + props.width - 5}px`};
  background-color: ${darkenColor('#9de3ff', 100)};
  width: 20px;
  height: 20px;
  border-radius: 10px;
  z-index: 999;
  cursor: pointer;
  pointer-events: all;
`;

const ExitButton: any = styled('div')`
  position: fixed;
  top: 0;
  right: 0;
  padding: 0 15px;
  text-align: right;
  background-color: black;
  color: white;
  cursor: pointer;
  z-index: 9999;
  transition: text-shadow 0.2s;
  text-shadow: none;
  pointer-events: all;
  &:hover {
    text-shadow: 1px 1px 3px rgba(255,255,255,0.4);
  }
`;

export interface StepInfo {
  element: string;
  tooltipText?: string;
}

export interface StepsProps {
  enabled?: boolean;
  initialStep: number;
  steps: StepInfo[];
  onExitClick: () => void;
}

export interface HelpInfoProps extends StepsProps {
}

export interface HelpInfoState {
  hints: any[];
}

export class HelpInfo extends React.Component<HelpInfoProps, HelpInfoState> {
  private prevElementStyle: string;

  constructor(props: HelpInfoProps) {
    super(props);
    this.state = {
      hints: [],
    };
  }

  public render() {
    const options = { ...{ skipLabel: 'Exit', doneLabel: 'Exit' } };
    return (
      <Animate
        className={css`position: absolute;`}
        animationEnter='fadeIn'
        animationLeave='fadeOut'
        durationEnter={200}
        durationLeave={200}
      >
        {this.state.hints.length > 0 && [
          <ExitButton onClick={this.props.onExitClick}>Exit Help Mode</ExitButton>,
          <HelpOverlay />,
        ]}
        {this.state.hints}
      </Animate>
    );
  }

  public componentWillReceiveProps(nextProps: HelpInfoProps) {
    if (this.props.enabled !== nextProps.enabled || !_.isEqual(this.props.steps, nextProps.steps)) {
      this.onToggleHints(nextProps.enabled);
    }
  }

  private onToggleHints = (enabled: boolean) => {
    if (enabled) {
      this.addHints();
      return;
    }
    this.removeHints();
  }

  private addHints = () => {
    const hints = [];
    this.props.steps.forEach((step, i) => {
      const classNameElement = document.getElementsByClassName(step.element).item(0);
      const idElement = document.getElementById(step.element);
      const element = classNameElement || idElement;
      if (element) {
        const { width, height, top, left } = element.getBoundingClientRect();
        hints.push(
          <div>
            <HelpContainer top={top} left={left} width={width} height={height} />
            {step.tooltipText &&
              <Tooltip
                content={step.tooltipText}
                styles={{
                  tooltip: {
                    zIndex: 9999,
                    backgroundColor: 'rgba(0,0,0,0.9)',
                    padding: '5px',
                  },
                }}>
                <TooltipIcon top={top} left={left} width={width}>?</TooltipIcon>
              </Tooltip>
            }
          </div>,
        );
      }
    });
    this.setState({ hints });
  }

  private removeHints = () => {
    this.setState({ hints: [] });
  }
}

export default HelpInfo;
