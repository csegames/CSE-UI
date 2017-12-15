/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { client, events, dxKeyCodes, SkillStateStatusEnum, SkillStateTypeEnum } from 'camelot-unchained';
import { SkillStateInfo } from './skillState';

export interface SkillStateConnectorProps {
  skillInfo: any;
  index: number;
}

export interface SkillStateConnectorState {
  keybind: string;
  label: string;
  skillState: SkillStateInfo;
  isClick: boolean;
  isRunning: boolean;
  isQueued: boolean;
  isCooldown: boolean;
  isError: boolean;
  innerCurrent: number;
}

export interface BasicButtonInfo {
  id: string;
  icon: string;
}

function skillStateConnector<PropsTypes extends any>() {
  return (WrappedComponent: React.ComponentClass<PropsTypes> | React.StatelessComponent<PropsTypes>) => {
    return class OldSkillButton extends React.Component<SkillStateConnectorProps, SkillStateConnectorState> {
      private cooldownDuration: number = 0;
      private cooldownStarted: number = 0;

      constructor(props: SkillStateConnectorProps) {
        super(props);
        this.state = {
          keybind: '',
          label: '',
          skillState: null,
          isClick: false,
          isRunning: false,
          isQueued: false,
          isCooldown: false,
          isError: false,
          innerCurrent: 0,
        };
      }

      public render() {
        const skillState = this.generateSkillState(this.props, this.state);
        return (
          <WrappedComponent
            {...this.props}
            skillState={skillState}
            name={this.props.skillInfo.name}
            description={this.props.skillInfo.notes}
          />
        );
      }

      public componentDidMount() {
        // client.OnSkillStateChanged(this.handleSkillStateChanged);

        client.SetSkillRunning(this.handleSkillRunning);
        client.SetSkillQueued(this.handleSkillQueued);
        client.UpdateSkillCooldown(this.handleCooldown);
        client.OnSkillError(this.handleSkillError);

        const keybindKey = 'Ability ' + this.props.index;
        client.GetConfigVar(keybindKey);
        client.OnReceiveConfigVar((configVar: any) => {
          if (configVar.hasOwnProperty(keybindKey)) {
            this.setState({ keybind: dxKeyCodes[configVar[keybindKey]] });
          }
        });
      }

      public componentWillUpdate(nextProps: SkillStateConnectorProps, nextState: SkillStateConnectorState) {
        events.fire('skillsbutton-' + nextProps.skillInfo.id, this.generateSkillState(nextProps, nextState));
        if (this.state.isQueued && !nextState.isQueued && nextState.isRunning) {
          this.handleClick();
        }
      }

      private handleClick = () => {
        this.setState({ isClick: true });
        setTimeout(() => this.setState({ isClick: false }), 500);
      }

      private handleSkillRunning = (abilityId: string, isRunning: boolean) => {
        if (this.props.skillInfo.id === abilityId) {
          if ((isRunning && this.state.isRunning) || (!isRunning && !this.state.isRunning)) return;
          if (isRunning) {
            this.handleClick();
          }
          this.setState({ isRunning });
        }
      }

      private handleSkillQueued = (abilityId: string, isQueued: boolean) => {
        if (this.props.skillInfo.id === abilityId) {
          if ((isQueued && this.state.isQueued) || (!isQueued && !this.state.isQueued)) return;
          this.setState({ isQueued });
        }
      }

      private handleCooldown = (abilityId: string, started: number, duration: number) => {
        if (this.props.skillInfo.id === abilityId && (started + duration) - client.serverTime >= 0.0) {
          this.cooldownStarted = started;
          const timeLeft = Math.round(duration * 1000);
          this.cooldownDuration = timeLeft;
          this.setState({ isCooldown: true });

          setTimeout(() => {
            this.cooldownStarted = 0;
            this.cooldownDuration = 0;
            this.setState({ isCooldown: false });
          }, timeLeft - 50);
        }
      }

      private handleSkillError = (abilityId: string) => {
        if (this.props.skillInfo.id === abilityId) {
          this.setState({ isError: true });

          setTimeout(() => this.setState({ isError: false }), 500);
        }
      }

      private generateSkillState = (props: SkillStateConnectorProps, state: SkillStateConnectorState) => {
        let status: SkillStateStatusEnum = SkillStateStatusEnum.Ready;
        let timing;

        if (state.isRunning) {
          status |= status | SkillStateStatusEnum.Running;
        }

        if (state.isError) {
          status |= status | SkillStateStatusEnum.Error;
        }

        if (state.isQueued) {
          status |= status | SkillStateStatusEnum.Queued;
        }

        if (state.isCooldown) {
          status |= status | SkillStateStatusEnum.Cooldown;
          timing = {
            current: client.serverTime - this.cooldownStarted,
            end: ((this.cooldownStarted + this.cooldownDuration) - client.serverTime),
          };
        }

        const skillState: SkillStateInfo = {
          id: props.skillInfo.id,
          info: {
            type: SkillStateTypeEnum.Standard,
            icon: props.skillInfo.icon,
            keybind: state.keybind,
          },
          status,
          timing,
        };

        return skillState;
      }

      // private handleSkillStateChanged = (clientSkillState: ClientSkillState) => {
      //   if (clientSkillState.id.toString(16) === this.props.skillInfo.id) {
      //     const skillState: SkillStateInfo = {
      //       id: clientSkillState.id,
      //       info: {
      //         type: clientSkillState.type,
      //         keybind: this.state.keybind,
      //         icon: this.props.skillInfo.icon,
      //       },
      //       status: clientSkillState.status,
      //       reason: clientSkillState.reason,
      //       timing: clientSkillState.timing,
      //       disruption: clientSkillState.disruption,
      //     };

      //     this.setState({ skillState });
      //   }
      // }
    };
  };
}

export default skillStateConnector;
