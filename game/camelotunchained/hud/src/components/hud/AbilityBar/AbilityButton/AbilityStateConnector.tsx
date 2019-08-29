/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import { InitialAbilityInfo } from '../index';
import { AbilityButtonInfo } from './AbilityButtonView';

export interface AbilityStateConnectorProps {
  abilityInfo: InitialAbilityInfo;
  index: number;
  numberOfAbilities: number;
}

export interface AbilityStateConnectorState {
  abilityState: AbilityButtonInfo;
}

export interface BasicButtonInfo {
  id: string;
  icon: string;
}

function abilityStateConnector<PropsTypes extends any>() {
  return (WrappedComponent: React.ComponentClass<any> | React.StatelessComponent<any>) => {
    return class AbilityButtonWrapper extends React.Component<AbilityStateConnectorProps, AbilityStateConnectorState> {
      private updateHandle: EventHandle;
      constructor(props: AbilityStateConnectorProps) {
        super(props);
        this.state = {
          abilityState: null,
        };
      }

      public render() {
        const abilityState = this.state.abilityState || this.props.abilityInfo;
        return (
          <WrappedComponent
            {...this.props}
            abilityInfo={abilityState}
            name={this.props.abilityInfo.name}
            description={this.props.abilityInfo.description}
          />
        );
      }

      public componentDidMount() {
        this.updateHandle = camelotunchained.game.abilityStates[this.props.abilityInfo.id]
          .onUpdated(this.handleClientAbilityStateChanged);
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

      public componentWillUnmount() {
        this.updateHandle.clear();
      }

      private handleApiAbilityStateChange = () => {
        const { abilityState } = this.state;
        if (abilityState) {
          const newAbilityState = {
            ...abilityState,
            type: abilityState ? abilityState.type : AbilityButtonType.Standard,
            keybind: abilityState ? abilityState.keyActionID : this.props.abilityInfo.boundKeyName,
            icon: this.props.abilityInfo.icon,
          };

          this.setState({ abilityState: newAbilityState });
        }
      }

      private handleClientAbilityStateChanged = () => {
        const newAbilityState = camelotunchained.game.abilityStates[this.props.abilityInfo.id];
        if (newAbilityState) {
          const abilityState = {
            ...newAbilityState,
            icon: this.props.abilityInfo.icon,
          };

          this.setState({ abilityState });
        }
      }
    };
  };
}

export default abilityStateConnector;
