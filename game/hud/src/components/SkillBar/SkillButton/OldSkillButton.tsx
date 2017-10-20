/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { client, events, dxKeyCodes } from 'camelot-unchained';

export interface OldSkillButtonProps {
  skillState: any;
  index: number;
}

export interface OldSkillButtonState {
  keybind: string;
  label: string;
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

function oldSkillButton<PropsTypes extends any>() {
  return (WrappedComponent: React.ComponentClass<PropsTypes> | React.StatelessComponent<PropsTypes>) => {
    return class OldSkillButton extends React.Component<OldSkillButtonProps, OldSkillButtonState> {
      private cooldownDuration: number = 0;
      private cooldownStarted: number = 0;

      constructor(props: OldSkillButtonProps) {
        super(props);
        this.state = {
          keybind: '',
          label: '',
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
            name={this.props.skillState.name}
            description={this.props.skillState.notes}
          />
        );
      }

      public componentDidMount() {
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

      public componentWillUpdate(nextProps: OldSkillButtonProps, nextState: OldSkillButtonState) {
        events.fire('skillsbutton-' + nextProps.skillState.id, this.generateSkillState(nextProps, nextState));
        if (this.state.isQueued && !nextState.isQueued && nextState.isRunning) {
          this.handleClick();
        }
      }

      private handleClick = () => {
        this.setState({ isClick: true });
        setTimeout(() => this.setState({ isClick: false }), 500);
      }

      private handleSkillRunning = (abilityId: string, isRunning: boolean) => {
        if (this.props.skillState.id === abilityId) {
          if ((isRunning && this.state.isRunning) || (!isRunning && !this.state.isRunning)) return;
          if (isRunning) {
            this.handleClick();
          }
          this.setState({ isRunning });
        }
      }

      private handleSkillQueued = (abilityId: string, isQueued: boolean) => {
        if (this.props.skillState.id === abilityId) {
          if ((isQueued && this.state.isQueued) || (!isQueued && !this.state.isQueued)) return;
          this.setState({ isQueued });
        }
      }

      private handleCooldown = (abilityId: string, started: number, duration: number) => {
        if (this.props.skillState.id === abilityId && (started + duration) - client.serverTime >= 0.0) {
          this.cooldownStarted = started;
          const timeLeft = Math.round(duration * 1000);
          this.cooldownDuration = timeLeft;
          this.setState({ isCooldown: true });

          setTimeout(() => {
            this.cooldownStarted = 0;
            this.cooldownDuration = 0;
            this.setState({ isCooldown: false });
          }, timeLeft);
        }
      }

      private handleSkillError = (abilityId: string) => {
        if (this.props.skillState.id === abilityId) {
          this.setState({ isError: true });

          setTimeout(() => this.setState({ isError: false }), 500);
        }
      }

      private generateSkillState = (props: OldSkillButtonProps, state: OldSkillButtonState) => {
        let status = 'ready';
        let timing;

        if (state.isClick) {
          status = status + ' startCast';
        }

        if (state.isRunning) {
          status = status + ' hold';
        }

        if (state.isError) {
          status = status + ' error';
        }

        if (state.isQueued) {
          status = status + ' queued';
        }

        if (state.isCooldown) {
          status = status + ' cooldown';
          timing = {
            current: client.serverTime - this.cooldownStarted,
            end: ((this.cooldownStarted + this.cooldownDuration) - client.serverTime),
          };
        }

        const skillState: any = {
          id: props.skillState.id,
          info: {
            type: 'standard',
            icon: props.skillState.icon,
            keybind: state.keybind,
            track: '',
          },
          status,
          timing,
        };

        return skillState;
      }
    };
  };
}

export default oldSkillButton;
