/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import {
  client,
  events,
  dxKeyCodes,
  ClientSkillState,
  SkillStateStatusEnum,
  SkillStateTypeEnum,
  SkillStateTrackEnum,
} from 'camelot-unchained';
import { SkillStateInfo } from './lib';

export interface SkillStateConnectorProps {
  skillInfo: any;
  index: number;
}

export interface SkillStateConnectorState {
  skillState: SkillStateInfo;
}

export interface BasicButtonInfo {
  id: string;
  icon: string;
}

function skillStateConnector<PropsTypes extends any>() {
  return (WrappedComponent: React.ComponentClass<PropsTypes> | React.StatelessComponent<PropsTypes>) => {
    return class SkillButtonWrapper extends React.Component<SkillStateConnectorProps, SkillStateConnectorState> {
      constructor(props: SkillStateConnectorProps) {
        super(props);
        this.state = {
          skillState: null,
        };
      }

      public render() {
        const skillState: SkillStateInfo = this.state.skillState || {
          id: this.props.skillInfo.id,
          info: {
            type: SkillStateTypeEnum.Standard,
            keybind: null,
            icon: this.props.skillInfo.icon,
          },
          track: SkillStateTrackEnum.PrimaryWeapon,
          status: SkillStateStatusEnum.Unusable,
        };
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
        client.OnSkillStateChanged(this.handleSkillStateChanged);
      }

      public componentDidCatch(error: Error, info: any) {
        console.log(error);
        console.log(info);
      }

      public componentWillUpdate(nextProps: SkillStateConnectorProps, nextState: SkillStateConnectorState) {
        if (nextState.skillState) {
          events.fire('skillsbutton-' + nextProps.skillInfo.id, nextState.skillState);
        }
      }

      private handleSkillStateChanged = (clientSkillState: ClientSkillState) => {
        if (clientSkillState.id === this.props.skillInfo.id) {
          const skillState: SkillStateInfo = {
            id: clientSkillState.id,
            info: {
              type: clientSkillState.type,
              keybind: dxKeyCodes[clientSkillState.keybind],
              icon: this.props.skillInfo.icon,
            },
            track: SkillStateTrackEnum.PrimaryWeapon,
            status: clientSkillState.status,
            reason: clientSkillState.reason,
            timing: clientSkillState.timing,
            disruption: clientSkillState.disruption,
          };

          this.setState({ skillState });
        }
      }
    };
  };
}

export default skillStateConnector;
