/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import { AbilityButtonInfo } from './AbilityButtonView';

export interface AbilityStateConnectorProps {
  abilityInfo: any;
  index: number;
}

export interface AbilityStateConnectorState {
  abilityState: AbilityButtonInfo;
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
        const abilityState = this.state.abilityState || {
          id: this.props.abilityInfo.id,
          type: AbilityButtonType.Standard,
          keybind: 0,
          boundKeyName: this.props.abilityInfo.boundKeyName,
          icon: this.props.abilityInfo.icon,
          track: AbilityTrack.PrimaryWeapon,
          status: AbilityButtonState.Unusable,
          isReady: false,
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

      public componentDidMount() {
        game.abilityStates[Number(this.props.abilityInfo.id)].onUpdated(this.handleClientAbilityStateChanged);
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
          game.trigger('abilitybutton-' + nextProps.abilityInfo.id, nextState.abilityState);
        }
      }

      private handleApiAbilityStateChange = () => {
        const { abilityState } = this.state;
        if (abilityState) {
          const newAbilityState = {
            ...abilityState,
            type: abilityState ? abilityState.type : AbilityButtonType.Standard,
            keybind: abilityState ? abilityState.keybind : this.props.abilityInfo.boundKeyName,
            icon: this.props.abilityInfo.icon,
          };

          this.setState({ abilityState: newAbilityState });
        }
      }

      private handleClientAbilityStateChanged = () => {
        const ability = game.abilityStates[this.props.abilityInfo.id];
        if (ability) {
          const abilityState = {
            ...ability,
            icon: this.props.abilityInfo.icon,
          };

          this.setState({ abilityState });
        }
      }
    };
  };
}

export default abilityStateConnector;
