/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import { client } from '@csegames/camelot-unchained';

import { ConfigIndex, ConfigInfo } from '../OptionsMain';
import ListItem from './ListItem';

export interface InputOptionsProps {
  inputConfigs: ConfigInfo[];
  onInputConfigsChange: (inputConfigs: ConfigInfo[]) => void;
  activeConfigIndex: number;
}

export interface InputOptionsState {
}

export class InputOptions extends React.Component<InputOptionsProps, InputOptionsState> {
  constructor(props: InputOptionsProps) {
    super(props);
    this.state = {
    };
  }

  public render() {
    return (
      <div>
        {this.props.inputConfigs.map((config, i) => {
          const val = config.value === 'true' ? 'Enabled' : 'Disabled';
          const isOdd = i % 2 !== 0;
          return (
            <ListItem
              value={val}
              key={config.name}
              name={config.name}
              isOddItem={isOdd}
              onClick={() => this.onInputConfigClick(config)}
            />
          );
        })}
      </div>
    );
  }

  public componentDidMount() {
    if (this.props.activeConfigIndex === ConfigIndex.INPUT) {
      client.GetConfigVars(ConfigIndex.INPUT);
    }
  }

  private onInputConfigClick = (inputConfig: ConfigInfo) => {
    const oppositeValue = inputConfig.value === 'false';
    const inputConfigs: ConfigInfo[] = this.props.inputConfigs.map((config) => {
      if (config.name === inputConfig.name) {
        return {
          ...inputConfig,
          value: `${oppositeValue}`,
        };
      }
      return config;
    });

    this.props.onInputConfigsChange(inputConfigs);
    client.ChangeConfigVar(inputConfig.name, `${oppositeValue}`);
    client.SaveConfigChanges();
  }
}

export default InputOptions;

