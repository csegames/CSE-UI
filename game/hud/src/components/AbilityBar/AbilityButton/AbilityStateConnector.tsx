/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import { AbilityStateInfo } from 'components/AbilityBar/AbilityButton/lib';

export interface AbilityStateConnectorProps {
  abilityInfo: any;
  index: number;
}

export interface AbilityStateConnectorState {
  abilityState: AbilityStateInfo;
}

export interface BasicButtonInfo {
  id: string;
  icon: string;
}

function abilityStateConnector<PropsTypes extends any>() {
  return (WrappedComponent: React.ComponentClass<PropsTypes> | React.StatelessComponent<PropsTypes>) => {
    return class AbilityButtonWrapper extends React.Component<AbilityStateConnectorProps, AbilityStateConnectorState> {
      constructor(props: AbilityStateConnectorProps) {
        super(props);
        this.state = {
          abilityState: null,
        };
      }

      public render() {
        const abilityState: AbilityStateInfo = this.state.abilityState || {
          id: this.props.abilityInfo.id,
          info: {
            type: AbilityButtonType.Standard,
            keybind: this.props.abilityInfo.boundKeyName,
            icon: this.props.abilityInfo.icon,
          },
          track: AbilityTrack.PrimaryWeapon,
          status: AbilityButtonState.Unusable,
        };
        return (
          <WrappedComponent
            {...this.props}
            AbilityState={abilityState}
            name={this.props.abilityInfo.name}
            description={this.props.abilityInfo.notes}
          />
        );
      }

      public shouldComponentUpdate(nextProps: AbilityStateConnectorProps, nextState: AbilityStateConnectorState) {
        return !_.isEqual(nextProps.abilityInfo, this.props.abilityInfo) ||
          !_.isEqual(nextState.abilityState, this.state.abilityState) ||
          nextProps.index !== this.props.index;
      }

      public componentDidUpdate(prevProps: AbilityStateConnectorProps) {
        if (!_.isEqual(prevProps.abilityInfo, this.props.abilityInfo)) {
          this.handleApiAbilityStateChange();
        }
      }

      public componentDidCatch(error: Error, info: any) {
        console.log(error);
        console.log(info);
      }

      public componentWillUpdate(nextProps: AbilityStateConnectorProps, nextState: AbilityStateConnectorState) {
        if (nextState.abilityState) {
          game.trigger('abilitysbutton-' + nextProps.abilityInfo.id, nextState.abilityState);
        }
      }

      private handleApiAbilityStateChange = () => {
        const { abilityState } = this.state;
        if (abilityState) {
          const newAbilityState: AbilityStateInfo = {
            ...abilityState,
            info: {
              type: abilityState.info ? abilityState.info.type : AbilityButtonType.Standard,
              keybind: abilityState.info ? abilityState.info.keybind : this.props.abilityInfo.boundKeyName,
              icon: this.props.abilityInfo.icon,
            },
          };

          this.setState({ abilityState: newAbilityState });
        }
      }

      private handleClientAbilityStateChanged = (clientAbilityState: AbilityState) => {
        if (clientAbilityState.id === this.props.abilityInfo.id) {
          const abilityState: AbilityStateInfo = {
            id: clientAbilityState.id.toString(),
            info: {
              type: clientAbilityState.type,
              keybind: clientAbilityState.boundKeyName,
              icon: this.props.abilityInfo.icon,
            },
            track: AbilityTrack.PrimaryWeapon,
            status: clientAbilityState.status,
            error: clientAbilityState.error,
            timing: clientAbilityState.timing,
            disruption: clientAbilityState.disruption,
          };

          this.setState({ abilityState });
        }
      }
    };
  };
}

export default abilityStateConnector;
